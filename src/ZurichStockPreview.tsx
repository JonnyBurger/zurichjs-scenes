import {Video} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";

// Licensing source — replace the watermarked preview after licensing:
export const SHUTTERSTOCK_LICENSE_SOURCE_URL =
  "https://www.shutterstock.com/video/clip-3894972599-zurich-switzerland---october-2-2024-day?trackingId=b90dec2d-79a9-4745-b9ce-b53417ece1f2&listId=searchResults";

export const ZurichStockPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
      <Video
        name="Unlicensed Shutterstock Zurich preview — 3894972599"
        src={staticFile("video/zurich-shutterstock-3894972599-preview.mp4")}
        muted
        objectFit="cover"
        premountFor={60}
        trimBefore={60}
        style={{height: "100%", width: "100%"}}
      />
    </AbsoluteFill>
  );
};
