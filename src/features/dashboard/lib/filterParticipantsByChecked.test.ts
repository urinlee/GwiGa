import { describe, expect, it } from 'vitest';

import { filteredParticipantsByStep } from './filterParticipantsByChecked';

type Participant = {
	username: string;
	enableStatus: Array<string | number>;
};

const participants: Participant[] = [
	{ username: 'alice', enableStatus: ['ready', 'help'] },
	{ username: 'bob', enableStatus: ['ready'] },
	{ username: 'chris', enableStatus: ['late', 'help'] },
	{ username: 'dana', enableStatus: [1, 'ready'] },
	{ username: 'eric', enableStatus: [] },
];

const createGetStepCheckedTags = (steps: Record<number, string[]>) => {
	return (step: number) => steps[step] ?? [];
};

describe('filteredParticipantsByStep', () => {
	it('returns all participants when no filters are selected', () => {
		const result = filteredParticipantsByStep({
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
		const result = filteredParticipantsByStep({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['help'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['bob', 'dana', 'eric']);
	});

	it('includes only participants that contain all step2 statuses', () => {
		const result = filteredParticipantsByStep({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 2: ['ready', 'help'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['alice']);
	});

	it('applies step1 and step2 together, with step1 exclusion taking precedence', () => {
		const result = filteredParticipantsByStep({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({
				1: ['help'],
				2: ['ready'],
			}),
		});

		expect(result.map((participant) => participant.username)).toEqual(['bob', 'dana']);
	});

	it('handles numeric statuses by string comparison', () => {
		const result = filteredParticipantsByStep({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 2: ['1'] }),
		});

		expect(result.map((participant) => participant.username)).toEqual(['dana']);
	});

	it('returns an empty array when input participants are empty', () => {
		const result = filteredParticipantsByStep({
			sortedParticipants: [],
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['ready'], 2: ['help'] }),
		});

		expect(result).toEqual([]);
	});

	it('does not mutate the original participants array', () => {
		const source = [...participants];

		filteredParticipantsByStep({
			sortedParticipants: source,
			getStepCheckedTags: createGetStepCheckedTags({ 1: ['ready'] }),
		});

		expect(source).toEqual(participants);
		expect(source).not.toBe(participants);
	});
});

