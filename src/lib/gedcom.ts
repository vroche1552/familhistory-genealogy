import { v4 as uuidv4 } from 'uuid';
import {
  TimelineEvent,
  GedcomEvent,
  GedcomIndividual,
  GedcomFamily,
  GedcomData,
  Person,
  Relationship,
  FamilyTree
} from './interfaces';

interface GedcomRecord {
  tag: string;
  data?: string;
  pointer?: string;
  tree: GedcomRecord[];
}

interface ParsedGedcom {
  people: {
    id: string;
    first_name: string;
    last_name: string;
    birth_date?: string;
    death_date?: string;
    gender: 'male' | 'female' | 'other';
    biography?: string;
  }[];
  relationships: {
    person1_id: string;
    person2_id: string;
    relationship_type: 'parent' | 'child' | 'spouse' | 'sibling';
  }[];
  treeName: string;
}

class GedcomParser {
  private data: GedcomData = {
    individuals: [],
    families: []
  };

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async parse(file: File): Promise<GedcomData> {
    try {
      console.log('Starting GEDCOM parsing...');
      const text = await (file as any).text();
      const lines = text.split('\n');
      console.log(`Processing ${lines.length} lines`);
      
      let currentIndividual: GedcomIndividual | null = null;
      let currentFamily: GedcomFamily | null = null;
      let currentEvent: GedcomEvent | null = null;

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 2) continue;

        const level = parseInt(parts[0]);
        let tag = parts[1];
        let value = parts.slice(2).join(' ');

        // Handle special case where tag is in the value (e.g., @I1@ INDI)
        if (tag.startsWith('@') && parts.length > 2) {
          const temp = tag;
          tag = parts[2];
          value = temp;
        }

        if (level === 0) {
          // Save the current individual or family before starting a new one
          if (currentIndividual) {
            this.data.individuals.push(currentIndividual);
            currentIndividual = null;
          }
          if (currentFamily) {
            this.data.families.push(currentFamily);
            currentFamily = null;
          }
          currentEvent = null;

          if (tag === 'INDI') {
            currentIndividual = {
              id: value,
              name: '',
              sex: 'U' as const,
              parents: [],
              children: [],
              spouses: []
            };
          } else if (tag === 'FAM') {
            currentFamily = {
              id: value,
              children: []
            };
          }
        } else if (level === 1) {
          if (currentIndividual) {
            switch (tag) {
              case 'NAME':
                currentIndividual.name = value;
                break;
              case 'SEX':
                currentIndividual.sex = value === 'M' ? 'M' : value === 'F' ? 'F' : 'U';
                break;
              case 'BIRT':
                currentIndividual.birth = { date: undefined, place: undefined };
                currentEvent = currentIndividual.birth;
                break;
              case 'DEAT':
                currentIndividual.death = { date: undefined, place: undefined };
                currentEvent = currentIndividual.death;
                break;
            }
          } else if (currentFamily) {
            switch (tag) {
              case 'HUSB':
                currentFamily.husband = value;
                break;
              case 'WIFE':
                currentFamily.wife = value;
                break;
              case 'CHIL':
                currentFamily.children.push(value);
                break;
              case 'MARR':
                currentFamily.marriage = { date: undefined, place: undefined };
                currentEvent = currentFamily.marriage;
                break;
            }
          }
        } else if (level === 2 && currentEvent) {
          switch (tag) {
            case 'DATE':
              currentEvent.date = value;
              break;
            case 'PLAC':
              currentEvent.place = value;
              break;
          }
        }
      }

      // Don't forget to add the last individual or family
      if (currentIndividual) {
        this.data.individuals.push(currentIndividual);
      }
      if (currentFamily) {
        this.data.families.push(currentFamily);
      }

      console.log('Parsing completed:', {
        individuals: this.data.individuals.length,
        families: this.data.families.length
      });

      return this.data;
    } catch (error) {
      console.error('Error parsing GEDCOM:', error);
      throw error;
    }
  }

  private parseDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    
    // Parse date in format "DD MMM YYYY"
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return undefined;
    
    const day = parts[0].padStart(2, '0');
    const month = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
      'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
      'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    }[parts[1].toUpperCase()];
    const year = parts[2];
    
    if (!month) return undefined;
    return `${year}-${month}-${day}`;
  }

  private parseLocation(place?: string): string | undefined {
    if (!place) return undefined;
    return place;
  }

  private extractYear(dateStr?: string): string {
    if (!dateStr) return 'Unknown';
    const match = dateStr.match(/\d{4}/);
    return match ? match[0] : 'Unknown';
  }

  private createTimelineEvent(type: TimelineEvent['type'], date?: string, location?: string): TimelineEvent {
    const now = new Date().toISOString();
    return {
      id: type + '-' + Math.random().toString(36).substr(2, 9),
      date: date || now,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: `${type} event`,
      type,
      location
    };
  }

  private parseName(name: string): [string, string] {
    // GEDCOM names are in the format "First /Last/"
    const parts = name.split('/');
    if (parts.length >= 2) {
      return [parts[0].trim(), parts[1].trim()];
    }
    // Fallback if the name doesn't follow the expected format
    const spaceIndex = name.indexOf(' ');
    if (spaceIndex > 0) {
      return [name.substring(0, spaceIndex).trim(), name.substring(spaceIndex + 1).trim()];
    }
    return [name.trim(), ''];
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private convertGedcomDateToISO(gedcomDate: string | undefined): string | undefined {
    if (!gedcomDate) return undefined;
    
    const months: { [key: string]: string } = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
      'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
      'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };

    const parts = gedcomDate.split(' ');
    if (parts.length !== 3) return undefined;

    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];

    if (!month) return undefined;
    return `${year}-${month}-${day}`;
  }

  private createPerson(indi: GedcomIndividual): Person {
    const now = new Date().toISOString();
    return {
      id: uuidv4(),
      first_name: indi.name.split('/')[0].trim(),
      last_name: indi.name.split('/')[1]?.trim() || '',
      birth_date: this.convertGedcomDateToISO(indi.birth?.date),
      death_date: this.convertGedcomDateToISO(indi.death?.date),
      gender: indi.sex === 'M' ? 'male' : indi.sex === 'F' ? 'female' : 'other',
      biography: '',
      created_by: 'system',
      created_at: now,
      updated_at: now,
      family_tree_id: null,
      birth_event: indi.birth ? {
        id: uuidv4(),
        date: this.convertGedcomDateToISO(indi.birth.date) || '',
        title: 'Birth',
        description: `Birth of ${indi.name}`,
        type: 'birth',
        location: indi.birth.place
      } : undefined,
      death_event: indi.death ? {
        id: uuidv4(),
        date: this.convertGedcomDateToISO(indi.death.date) || '',
        title: 'Death',
        description: `Death of ${indi.name}`,
        type: 'death',
        location: indi.death.place
      } : undefined
    };
  }

  public transformToFamilyTree(): FamilyTree {
    const people: Person[] = [];
    const relationships: Relationship[] = [];
    const now = new Date().toISOString();

    // Create people
    for (const indi of this.data.individuals) {
      const person = this.createPerson(indi);
      people.push(person);
    }

    // Create relationships
    for (const family of this.data.families) {
      if (family.husband && family.wife) {
        relationships.push({
          id: uuidv4(),
          person1_id: family.husband,
          person2_id: family.wife,
          relationship_type: 'spouse',
          start_date: this.convertGedcomDateToISO(family.marriage?.date),
          end_date: null,
          notes: '',
          created_by: 'system',
          created_at: now,
          updated_at: now,
          family_tree_id: null
        });
      }

      for (const childId of family.children) {
        if (family.husband) {
          relationships.push({
            id: uuidv4(),
            person1_id: family.husband,
            person2_id: childId,
            relationship_type: 'parent',
            start_date: undefined,
            end_date: null,
            notes: '',
            created_by: 'system',
            created_at: now,
            updated_at: now,
            family_tree_id: null
          });
        }
        if (family.wife) {
          relationships.push({
            id: uuidv4(),
            person1_id: family.wife,
            person2_id: childId,
            relationship_type: 'parent',
            start_date: undefined,
            end_date: null,
            notes: '',
            created_by: 'system',
            created_at: now,
            updated_at: now,
            family_tree_id: null
          });
        }
      }
    }

    return {
      id: uuidv4(),
      name: people.length > 0 ? `${people[0].first_name} ${people[0].last_name} Family Tree` : 'New Family Tree',
      description: 'Imported from GEDCOM file',
      created_by: 'system',
      created_at: now,
      updated_at: now,
      people,
      relationships
    };
  }

  private getRelations(individual: GedcomIndividual) {
    const relations = [];
    
    // Find parents
    for (const parentId of individual.parents) {
      const parent = this.data.individuals.find(i => i.id === parentId);
      if (parent) {
        relations.push({
          id: parentId,
          name: parent.name,
          relationType: 'parent' as const
        });
      }
    }

    // Find children
    const family = this.data.families.find(f =>
      f.husband === individual.id || f.wife === individual.id
    );
    if (family && family.children) {
      for (const childId of family.children) {
        const child = this.data.individuals.find(i => i.id === childId);
        if (child) {
          relations.push({
            id: childId,
            name: child.name,
            relationType: 'child' as const
          });
        }
      }
    }

    // Find spouses
    for (const spouseId of individual.spouses) {
      const spouse = this.data.individuals.find(i => i.id === spouseId);
      if (spouse) {
        relations.push({
          id: spouseId,
          name: spouse.name,
          relationType: 'spouse' as const
        });
      }
    }

    return relations;
  }

  private createTimeline(individual: GedcomIndividual): TimelineEvent[] {
    const timeline: TimelineEvent[] = [];
    const now = new Date().toISOString();

    if (individual.birth?.date || individual.birth?.place) {
      timeline.push(this.createTimelineEvent(
        'birth',
        this.parseDate(individual.birth?.date) || now,
        this.parseLocation(individual.birth?.place)
      ));
    }

    // Add marriage events
    for (const spouseId of individual.spouses) {
      const spouse = this.data.individuals.find(i => i.id === spouseId);
      if (spouse) {
        const family = this.data.families.find(f =>
          (f.husband === individual.id && f.wife === spouseId) ||
          (f.wife === individual.id && f.husband === spouseId)
        );
        if (family && family.marriage) {
          timeline.push(this.createTimelineEvent(
            'marriage',
            this.parseDate(family.marriage?.date) || now,
            this.parseLocation(family.marriage?.place)
          ));
        }
      }
    }

    if (individual.death?.date || individual.death?.place) {
      timeline.push(this.createTimelineEvent(
        'death',
        this.parseDate(individual.death?.date) || now,
        this.parseLocation(individual.death?.place)
      ));
    }

    return timeline;
  }
}

export async function parseGedcomFile(file: File): Promise<ParsedGedcom> {
  try {
    console.log('Starting GEDCOM file processing:', file.name);
    
    if (!file.name.toLowerCase().endsWith('.ged') && !file.name.toLowerCase().endsWith('.gedcom')) {
      throw new Error('Invalid file type. Please upload a GEDCOM file (.ged or .gedcom)');
    }

    const parser = new GedcomParser();
    console.log('Created parser instance');

    const data = await parser.parse(file);
    console.log('GEDCOM data parsed:', {
      individuals: data.individuals.length,
      families: data.families.length
    });

    const tree = parser.transformToFamilyTree();
    console.log('Family tree transformed:', {
      people: tree.people.length,
      relationships: tree.relationships.length,
      treeName: tree.name
    });

    // Map individuals to GedcomPerson format
    const people = tree.people.map(member => ({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      birth_date: member.birth_date,
      death_date: member.death_date,
      gender: member.gender,
      biography: member.biography || ''
    }));

    console.log('GEDCOM processing complete:', {
      peopleCount: people.length,
      relationshipsCount: tree.relationships.length,
      treeName: tree.name,
      samplePerson: people[0]
    });

    return {
      people,
      relationships: tree.relationships,
      treeName: tree.name
    };
  } catch (error) {
    console.error('Error processing GEDCOM file:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while processing the GEDCOM file'
    );
  }
} 