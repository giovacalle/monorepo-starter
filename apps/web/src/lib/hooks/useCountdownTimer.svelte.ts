import { onDestroy } from 'svelte';

/**
 * Custom hook for managing a countdown timer
 * @param initialTime - Initial time in seconds
 * @returns Object with timer state and controls
 */
export function useCountdownTimer(initialTime: number = 180) {
	let timeLeft = $state(initialTime);
	let timerInterval: NodeJS.Timeout | null = null;
	const isActive = $derived(timeLeft > 0);

	function startTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		timeLeft = initialTime;
		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				clearInterval(timerInterval!);
				timerInterval = null;
			}
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function resetTimer() {
		stopTimer();
		timeLeft = initialTime;
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Auto-cleanup on component destroy
	onDestroy(() => {
		stopTimer();
	});

	return {
		get timeLeft() {
			return timeLeft;
		},
		get isActive() {
			return isActive;
		},
		get isWarning() {
			return timeLeft <= 30;
		},
		get formattedTime() {
			return formatTime(timeLeft);
		},
		startTimer,
		stopTimer,
		resetTimer,
		formatTime
	};
}
