import { Composition, staticFile } from "remotion";
import { VENUE_REEL_DURATION_SEC, VenueReel } from "./VenueReel";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VenueReel"
        component={VenueReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={Math.ceil(VENUE_REEL_DURATION_SEC * 30)}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
