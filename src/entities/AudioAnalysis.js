export class AudioAnalysis {
  /**
   * @param {string} prediction
   * @param {number} confidence
   * @param {string | null} audioUrl
   */
  constructor(prediction, confidence, audioUrl = null) {
    this.prediction = prediction;
    this.confidence = confidence;
    this.audioUrl = audioUrl;
  }
}
