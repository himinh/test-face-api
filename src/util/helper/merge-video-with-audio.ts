// import fluentFfmpeg from 'fluent-ffmpeg';

// type Options = {
//   videoPath: string;
//   audioPath: string;
//   outputPath: string;
//   audioStartTime: number; // seconds
//   duration: number; // seconds
//   audioVolume: number; // Set the audio volume level (0.0 to 1.0)
//   videoVolume: number; // Set the audio volume level (0.0 to 1.0)
// };

// // Function to merge video and audio
// export const mergeVideoWithAudio = async ({
//   audioStartTime = 30,
//   duration = 30,
//   audioVolume = 1.0,
//   videoVolume = 0.5,
//   videoPath,
//   audioPath,
//   outputPath,
// }: Options) => {
//   return new Promise(async (resolve, reject) => {
//     fluentFfmpeg()
//       .addInput(videoPath)
//       .addInput(audioPath)
//       .seekInput(audioStartTime)
//       .outputOptions([
//         '-c:v copy', // Copy the video codec without re-encoding
//         '-c:a aac', // Use the AAC audio codec for the output
//         '-strict experimental', // Needed to use the AAC codec with older versions of ffmpeg
//       ])
//       .complexFilter([
//         {
//           filter: 'volume',
//           options: videoVolume,
//           inputs: '0:a', // Use '0:a' for video audio
//           outputs: '[s1]',
//         },
//         {
//           filter: 'volume',
//           options: audioVolume,
//           inputs: '1:a', // Use '1:a' for external audio
//           outputs: '[s2]',
//         },
//         {
//           filter: 'amix',
//           inputs: ['[s1]', '[s2]'],
//           options: ['duration=first', 'dropout_transition=0'],
//         },
//       ])
//       .duration(duration)
//       .output(outputPath)
//       .on('end', () => {
//         resolve(true);
//       })
//       .on('error', (err) => {
//         reject(err);
//       })
//       .run();
//   });
// };
