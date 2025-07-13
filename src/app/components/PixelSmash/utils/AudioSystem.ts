// app/components/PixelSmash/utils/AudioSystem.ts
export class AudioSystem {
  private static frequencies: { [key: string]: number } = {
    bounce: 200,
    break: 400,
    powerup: 600,
    lose_life: 100,
    pause: 150,
    start: 500,
    level_up: 800
  };

  static playSound(soundType: string): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(
        this.frequencies[soundType] || 300,
        audioContext.currentTime
      );
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not available');
    }
  }
}
