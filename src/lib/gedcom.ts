import { GedcomData, Person, FamilyTree, Location, Education, Document, Image, TimelineEvent } from '@/types';

export class GedcomParser {
  private data: GedcomData = {
    individuals: [],
    families: []
  };

  async parse(file: File): Promise<GedcomData> {
    const text = await this.readFile(file);
    const lines = text.split('\n');
    let currentIndividual: any = null;
    let currentFamily: any = null;
    let currentLevel = 0;

    for (const line of lines) {
      const [level, tag, ...values] = line.trim().split(/\s+/);
      const currentLevelNum = parseInt(level);

      if (currentLevelNum === 0) {
        // New record
        if (tag === 'INDI') {
          currentIndividual = {
            id: values[0].replace(/^@|@$/, ''),
            name: '',
            birth: {},
            death: {},
            parents: [],
            children: [],
            spouses: []
          };
          this.data.individuals.push(currentIndividual);
        } else if (tag === 'FAM') {
          currentFamily = {
            id: values[0].replace(/^@|@$/, ''),
            husband: '',
            wife: '',
            children: [],
            marriage: {}
          };
          this.data.families.push(currentFamily);
        }
      } else if (currentLevelNum === 1) {
        // Details
        if (currentIndividual) {
          switch (tag) {
            case 'NAME':
              currentIndividual.name = values.join(' ');
              break;
            case 'BIRT':
              currentLevel = 2;
              break;
            case 'DEAT':
              currentLevel = 2;
              break;
            case 'FAMC':
              currentIndividual.parents.push(values[0].replace(/^@|@$/, ''));
              break;
            case 'FAMS':
              currentIndividual.spouses.push(values[0].replace(/^@|@$/, ''));
              break;
          }
        } else if (currentFamily) {
          switch (tag) {
            case 'HUSB':
              currentFamily.husband = values[0].replace(/^@|@$/, '');
              break;
            case 'WIFE':
              currentFamily.wife = values[0].replace(/^@|@$/, '');
              break;
            case 'CHIL':
              currentFamily.children.push(values[0].replace(/^@|@$/, ''));
              break;
            case 'MARR':
              currentLevel = 2;
              break;
          }
        }
      } else if (currentLevelNum === 2) {
        // Date/Place details
        if (currentIndividual) {
          if (tag === 'DATE') {
            if (currentLevel === 2) {
              if (currentLevel === 2) {
                currentIndividual.birth.date = values.join(' ');
              } else if (currentLevel === 2) {
                currentIndividual.death.date = values.join(' ');
              }
            }
          } else if (tag === 'PLAC') {
            if (currentLevel === 2) {
              if (currentLevel === 2) {
                currentIndividual.birth.place = values.join(' ');
              } else if (currentLevel === 2) {
                currentIndividual.death.place = values.join(' ');
              }
            }
          }
        } else if (currentFamily) {
          if (tag === 'DATE') {
            currentFamily.marriage.date = values.join(' ');
          } else if (tag === 'PLAC') {
            currentFamily.marriage.place = values.join(' ');
          }
        }
        currentLevel = 1;
      }
    }

    return this.data;
  }

  private async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  transformToFamilyTree(): FamilyTree {
    const rootPerson = this.data.individuals[0];
    if (!rootPerson) {
      throw new Error('No individuals found in GEDCOM data');
    }

    const members: Person[] = this.data.individuals.map(indi => ({
      id: indi.id,
      name: indi.name,
      birthDate: this.parseDate(indi.birth?.date),
      deathDate: this.parseDate(indi.death?.date),
      birthPlace: this.parseLocation(indi.birth?.place),
      deathPlace: this.parseLocation(indi.death?.place),
      occupation: '',
      education: [],
      biography: '',
      documents: [],
      images: [],
      relations: this.getRelations(indi),
      timeline: this.createTimeline(indi),
      keyFacts: [],
      metadata: {
        tags: [],
        notes: '',
        privacy: 'public'
      }
    }));

    return {
      id: `tree-${rootPerson.id}`,
      name: `${rootPerson.name}'s Family Tree`,
      rootPersonId: rootPerson.id,
      members,
      metadata: {
        description: `Family tree imported from GEDCOM file`,
        createdBy: 'gedcom-import',
        createdAt: new Date(),
        lastModified: new Date()
      }
    };
  }

  private getRelations(individual: any): any[] {
    const relations: any[] = [];

    // Add parents
    for (const parentId of individual.parents) {
      const parent = this.data.individuals.find(i => i.id === parentId);
      if (parent) {
        relations.push({
          id: `rel-${parent.id}`,
          name: parent.name,
          birthYear: this.extractYear(parent.birth?.date),
          deathYear: this.extractYear(parent.death?.date),
          relationType: 'parent'
        });
      }
    }

    // Add children
    for (const spouseId of individual.spouses) {
      const family = this.data.families.find(f => 
        f.husband === individual.id || f.wife === individual.id
      );
      if (family) {
        for (const childId of family.children) {
          const child = this.data.individuals.find(i => i.id === childId);
          if (child) {
            relations.push({
              id: `rel-${child.id}`,
              name: child.name,
              birthYear: this.extractYear(child.birth?.date),
              deathYear: this.extractYear(child.death?.date),
              relationType: 'child'
            });
          }
        }
      }
    }

    // Add spouses
    for (const spouseId of individual.spouses) {
      const spouse = this.data.individuals.find(i => i.id === spouseId);
      if (spouse) {
        const family = this.data.families.find(f => 
          (f.husband === individual.id && f.wife === spouseId) ||
          (f.wife === individual.id && f.husband === spouseId)
        );
        relations.push({
          id: `rel-${spouse.id}`,
          name: spouse.name,
          birthYear: this.extractYear(spouse.birth?.date),
          deathYear: this.extractYear(spouse.death?.date),
          relationType: 'spouse',
          marriageDate: family?.marriage?.date,
          marriagePlace: family?.marriage?.place
        });
      }
    }

    return relations;
  }

  private createTimeline(individual: any): TimelineEvent[] {
    const timeline: TimelineEvent[] = [];

    if (individual.birth?.date || individual.birth?.place) {
      timeline.push({
        id: `event-${individual.id}-birth`,
        year: this.extractYear(individual.birth?.date) || 'Unknown',
        event: 'birth',
        icon: 'User',
        description: `Born ${individual.birth?.date ? `on ${individual.birth.date}` : ''} ${individual.birth?.place ? `in ${individual.birth.place}` : ''}`,
        location: this.parseLocation(individual.birth?.place)
      });
    }

    for (const spouseId of individual.spouses) {
      const family = this.data.families.find(f => 
        (f.husband === individual.id && f.wife === spouseId) ||
        (f.wife === individual.id && f.husband === spouseId)
      );
      if (family && (family.marriage?.date || family.marriage?.place)) {
        const spouse = this.data.individuals.find(i => i.id === spouseId);
        if (spouse) {
          timeline.push({
            id: `event-${individual.id}-marriage-${spouse.id}`,
            year: this.extractYear(family.marriage?.date) || 'Unknown',
            event: 'marriage',
            icon: 'Heart',
            description: `Married to ${spouse.name} ${family.marriage?.date ? `on ${family.marriage.date}` : ''} ${family.marriage?.place ? `in ${family.marriage.place}` : ''}`,
            location: this.parseLocation(family.marriage?.place)
          });
        }
      }
    }

    if (individual.death?.date || individual.death?.place) {
      timeline.push({
        id: `event-${individual.id}-death`,
        year: this.extractYear(individual.death?.date) || 'Unknown',
        event: 'death',
        icon: 'User',
        description: `Died ${individual.death?.date ? `on ${individual.death.date}` : ''} ${individual.death?.place ? `in ${individual.death.place}` : ''}`,
        location: this.parseLocation(individual.death?.place)
      });
    }

    return timeline;
  }

  private parseDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
  }

  private parseLocation(placeStr?: string): Location | undefined {
    if (!placeStr) return undefined;
    const parts = placeStr.split(',').map(p => p.trim());
    return {
      city: parts[0],
      country: parts.slice(1).join(',')
    };
  }

  private extractYear(date?: string): string | undefined {
    if (!date) return undefined;
    const match = date.match(/\d{4}/);
    return match ? match[0] : undefined;
  }
} 