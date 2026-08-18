import { describe, expect, it } from 'vitest';

import type { ParticipantsInfoCardProps, stateType } from '../types';
import { filterParticipantsByStatus, countParticipantsByStatus } from './filterParticipantsByChecked';

const allStatuses: stateType[] = ['ready', 'help', 'late', 'custom-tag'].map((id) => ({
	id,
	name: id,
	primaryColor: '#000000',
	secondaryColor: '#FFFFFF',
}));

const byId = (id: string) => allStatuses.find((status) => status.id === id)!;

/** 켜진 상태 id만 주면 나머지는 isTrue=false로 채운다 */
const createParticipant = (username: string, enabledIds: string[]): ParticipantsInfoCardProps => ({
	memberId: `member-${username}`,
	username,
	userStatus: allStatuses.map((status) => ({ ...status, isTrue: enabledIds.includes(status.id) })),
});

const participants: ParticipantsInfoCardProps[] = [
	createParticipant('alice', ['ready', 'help']),
	createParticipant('bob', ['ready']),
	createParticipant('chris', ['late', 'help']),
	createParticipant('dana', ['ready', 'custom-tag']),
	createParticipant('eric', []),
];

const createGetStepCheckedTags = (steps: Record<number, string[]>) => {
	return (step: number) => (steps[step] ?? []).map(byId);
};

describe('filteredParticipantsByStep', () => {
	it('returns all participants when no filters are selected', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({}),
		});

		expect(result.map((participant) => participant.username)).toEqual([
			'alice',
			'bob',
			'chris',
			'dana',
			'eric',
		]);
	});

	it('excludes participants that contain any step1 status', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['help'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['bob', 'dana', 'eric']);
	});

	it('includes only participants that contain all step2 statuses', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 2: ['ready', 'help'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['alice']);
	});

	it('applies step1 and step2 together, with step1 exclusion taking precedence', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({
				1: ['help'],
				2: ['ready'],
			}),
		});

		expect(result.map((participant) => participant.username)).toEqual(['bob', 'dana']);
	});

	it('handles custom string statuses that are not predefined', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 2: ['custom-tag'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['dana']);
	});

	it('returns an empty array when input participants are empty', () => {
		const result = filterParticipantsByStatus({
			sortedParticipants: [],
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['ready'], 2: ['help'] }),
		});

		expect(result).toEqual([]);
	});

	it('does not mutate the original participants array', () => {
		const source = [...participants];

		filterParticipantsByStatus({
			sortedParticipants: source,
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['ready'] }),
		});

		expect(source).toEqual(participants);
		expect(source).not.toBe(participants);
	});

	it('the number of people who have finished work on something', () => {
		const result = countParticipantsByStatus(participants, allStatuses);
		expect(result).toEqual({
			ready: 3,
			help: 2,
			late: 1,
			'custom-tag': 1,
		});
	});
});
