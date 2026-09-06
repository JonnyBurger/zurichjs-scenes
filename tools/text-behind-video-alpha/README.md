# Text Behind Video — alpha-layer fork

Local fork of [webml-community/text-behind-video](https://huggingface.co/spaces/webml-community/text-behind-video), licensed under MIT.

The original demo bakes text and foreground into one WebM. This fork keeps the BEN2 frame-segmentation workflow, then uses Mediabunny `CanvasSource` encoders with VP9 and `alpha: "keep"` to produce two synchronized assets:

- `text-behind-video-background.webm`: the original frame with the segmented foreground cut out
- `text-behind-video-foreground.webm`: the segmented foreground on transparency

This lets Remotion place editable content between the two videos.

```bash
npm install
npm run dev
```

Load a source clip, wait for segmentation, select **Export**, then download each generated layer separately. Separate download buttons avoid browser multi-download restrictions.
