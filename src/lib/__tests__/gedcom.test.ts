import { parseGedcomFile } from '../gedcom';
import fs from 'fs/promises';
import path from 'path';

describe('GEDCOM Parser', () => {
  it('should parse a GEDCOM file correctly', async () => {
    // Read the test.ged file
    const gedcomContent = await fs.readFile(path.join(process.cwd(), 'test.ged'), 'utf-8');
    
    // Create a File-like object
    const gedcomFile = {
      name: 'test.ged',
      type: 'text/plain',
      text: async () => gedcomContent
    } as File;

    const result = await parseGedcomFile(gedcomFile);

    // Verify the structure
    expect(result).toHaveProperty('people');
    expect(result).toHaveProperty('relationships');
    expect(result).toHaveProperty('treeName');

    // Verify people
    expect(result.people).toHaveLength(3);
    
    // Check John Smith
    const john = result.people.find(p => p.first_name === 'John' && p.last_name === 'Smith');
    expect(john).toBeDefined();
    expect(john?.gender).toBe('male');
    expect(john?.birth_date).toBeDefined();
    expect(john?.death_date).toBeDefined();

    // Check Mary Jones
    const mary = result.people.find(p => p.first_name === 'Mary' && p.last_name === 'Jones');
    expect(mary).toBeDefined();
    expect(mary?.gender).toBe('female');
    expect(mary?.birth_date).toBeDefined();

    // Check James Smith
    const james = result.people.find(p => p.first_name === 'James' && p.last_name === 'Smith');
    expect(james).toBeDefined();
    expect(james?.gender).toBe('male');
    expect(james?.birth_date).toBeDefined();

    // Verify relationships
    expect(result.relationships).toHaveLength(3); // 2 parent-child + 1 spouse relationship
    
    // Check spouse relationship
    const spouseRelation = result.relationships.find(
      r => r.relationship_type === 'spouse' && 
           r.person1_id === '@I1@' && 
           r.person2_id === '@I2@'
    );
    expect(spouseRelation).toBeDefined();

    // Check parent-child relationships
    const parentChildRelations = result.relationships.filter(
      r => r.relationship_type === 'parent' &&
           r.person2_id === '@I3@'
    );
    expect(parentChildRelations).toHaveLength(2);

    // Check specific values
    expect(john?.birth_date).toBe('1900-01-01');
    expect(john?.death_date).toBe('1970-12-01');
    expect(mary?.birth_date).toBe('1905-03-15');
    expect(james?.birth_date).toBe('1930-06-10');
  });
}); 