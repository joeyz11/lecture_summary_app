export function convertTimestampTextToTranscription(timestampText) {
    let transcript = "";
    const regex = /\[\d+:\d+:\d+\]/;
    const lines = timestampText.split(regex);

    lines.forEach((line) => {
        transcript += `${line.trim()} `;
    });

    return transcript.trim();
}
