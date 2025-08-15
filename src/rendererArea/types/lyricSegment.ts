export interface LyricSegment {
  /** The lyric line (a single phrase). Should not include line breaks. */
  text: string;
  /** Optional pronunciation/reading shown ABOVE the lyric (e.g., furigana/romaji). */
  pronunciation?: string;
  /** Segment start time in seconds from the beginning of the track. */
  start: number;
  /** Segment end time in seconds. Must be > start. */
  end: number;
}