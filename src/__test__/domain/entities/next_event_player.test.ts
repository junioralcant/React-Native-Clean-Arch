import {expect, it, describe} from '@jest/globals';
import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';

function initialsOf(name: string): string {
  return NextEventPlayerEntity.create({id: '', name, isConfirmed: true})
    .initials;
}

describe('NextEventPlayerEntity initials generation', () => {
  it('should return the first letter of the first and last names', () => {
    expect(initialsOf('Junior Marques')).toBe('JM');
    expect(initialsOf('Pedro Murilo')).toBe('PM');
    expect(initialsOf('Brenda Rayane de Marques')).toBe('BM');
  });

  it('should return the first letters of the first name', () => {
    expect(initialsOf('Junior')).toBe('JU');
    expect(initialsOf('J')).toBe('J');
  });

  it('should return "-" when name is empty', () => {
    expect(initialsOf('')).toBe('-');
  });

  it('should convert to uppercase', () => {
    expect(initialsOf('junior marques')).toBe('JM');
    expect(initialsOf('pedro')).toBe('PE');
    expect(initialsOf('p')).toBe('P');
  });

  it('should ignore extra white spaces', () => {
    expect(initialsOf('junior marques ')).toBe('JM');
    expect(initialsOf(' junior marques')).toBe('JM');
    expect(initialsOf('junior  marques')).toBe('JM');
    expect(initialsOf(' junior  marques ')).toBe('JM');
    expect(initialsOf(' pedro')).toBe('PE');
    expect(initialsOf(' p ')).toBe('P');
  });
});
