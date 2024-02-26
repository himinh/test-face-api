// import fluentFfmpeg from 'fluent-ffmpeg';

// type Options = {
//   imagePath: string;
//   audioPath: string;
//   outputPath: string;
//   fps?: number; // 24, 30, and 60
//   audioStartTime?: number; // seconds
//   duration?: number; // seconds
//   videoWide?: number;
//   videoTall?: number;
//   audioVolume?: number; // Set the audio volume level (0.0 to 1.0)
//   videoBitrate?: string;
// };

// // Function to merge audio and image
// export const mergeImageWithAudio = async ({
//   fps = 30,
//   audioStartTime = 0,
//   duration = 30,
//   videoWide = 440,
//   videoTall = 800,
//   audioVolume = 1.0,
//   videoBitrate = '1500k',
//   ...options
// }: Options) => {
//   const fadeOutStartTime = duration - 2; // Start fading out 2 seconds before the end

//   return new Promise((resolve, reject) => {
//     fluentFfmpeg()
//       .input(options.imagePath)
//       .inputOptions([`-framerate ${fps}`]) // Set input frame rate
//       .input(options.audioPath)
//       .audioFilters([`afade=out:st=${fadeOutStartTime}:d=2`])
//       .videoCodec('libx264')
//       .seekInput(audioStartTime)
//       .duration(duration)
//       .fps(fps) // Set output frame rate
//       .outputOptions([
//         '-pix_fmt yuv420p', // YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
//         `-vf scale=${videoWide}:${videoTall}`,
//         `-af volume=${audioVolume}`,
//         `-b:v ${videoBitrate}`, // Set the video bitrate
//       ])
//       .aspectRatio('9:16')
//       .saveToFile(options.outputPath)
//       .on('end', () => resolve(true))
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// };
