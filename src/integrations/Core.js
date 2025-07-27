import { AudioAnalysis } from "../entities/AudioAnalysis";

export class CoreApi {
  /**
   * @param {File} file
   * @returns {Promise<AudioAnalysis>}
   */
  static async predict(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://140.115.87.33:51174/predict/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new AudioAnalysis(data.prediction, data.confidence, data.audioUrl);
  }
}
