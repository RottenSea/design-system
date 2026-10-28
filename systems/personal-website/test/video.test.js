import assert from "node:assert/strict";
import { test } from "node:test";
import { videoSource } from "../src/components/media/video.js";

const embed = (src) => videoSource({ src })?.embed;

test("video page addresses become players", () => {
  assert.equal(
    embed("https://www.bilibili.com/video/BV1GJ411x7h7/?p=2&spm_id_from=x"),
    "https://player.bilibili.com/player.html?bvid=BV1GJ411x7h7&p=2&autoplay=1"
  );
  assert.equal(
    embed("https://www.bilibili.com/video/av170001"),
    "https://player.bilibili.com/player.html?aid=170001&autoplay=1"
  );
  assert.equal(
    embed("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&start=90"
  );
  assert.equal(embed("https://youtu.be/dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1");
  assert.equal(
    embed("https://www.youtube.com/shorts/abcDEF12345"),
    "https://www.youtube-nocookie.com/embed/abcDEF12345?autoplay=1"
  );
  assert.equal(embed("https://www.acfun.cn/v/ac48905554"), "https://www.acfun.cn/player/ac48905554");
  assert.equal(embed("https://m.acfun.cn/v/ac48905554"), "https://www.acfun.cn/player/ac48905554");
  assert.equal(embed("https://vimeo.com/76979871"), "https://player.vimeo.com/video/76979871?autoplay=1");
});

test("each video keeps a link to its own page", () => {
  assert.equal(
    videoSource({ src: "https://youtu.be/dQw4w9WgXcQ?t=42" })?.page,
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42"
  );
  assert.equal(
    videoSource({ provider: "acfun", videoId: "48905554" })?.page,
    "https://www.acfun.cn/v/ac48905554"
  );
});

test("files play through <video>, and other addresses are taken as players", () => {
  assert.deepEqual(videoSource({ src: "/video/build.mp4" }), {
    provider: "file",
    kind: "file",
    embed: "/video/build.mp4",
    page: "/video/build.mp4"
  });
  const other = videoSource({ src: "https://example.com/player?id=1" });
  assert.equal(other?.provider, undefined);
  assert.equal(other?.embed, "https://example.com/player?id=1");
  assert.equal(videoSource({}), undefined);
});
