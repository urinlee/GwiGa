import { describe, expect, it } from 'vitest';

import { ParticipantsInfoCardProps } from '../components/ParticipateInfoCard/ParticipantsInfoCard';
import { filteredParticipantsByStep } from './filterParticipantsByChecked';

const allStatuses = ['ready', 'help', 'late', 'custom-tag'] as const;

const participants: ParticipantsInfoCardProps[] = [
	{ username: 'alice', allStatus: [...allStatuses], enableStatus: ['ready', 'help'] },
	{ username: 'bob', allStatus: [...allStatuses], enableStatus: ['ready'] },
	{ username: 'chris', allStatus: [...allStatuses], enableStatus: ['late', 'help'] },
	{ username: 'dana', allStatus: [...allStatuses], enableStatus: ['ready', 'custom-tag'] },
	{ username: 'eric', allStatus: [...allStatuses], enableStatus: [] },
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

	it('handles custom string statuses that are not predefined', () => {
		const result = filteredParticipantsByStep({
			sortedParticipants: participants,
			getStepCheckedTags: createGetStepCheckedTags({ 2: ['custom-tag'] }),
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

