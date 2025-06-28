export default function splitParagraph(paragraph) {
    const MIN_LENGTH = 280;
    const sentences = paragraph.split(". ");

    let currentParagraph = "";
    let paragraphs = [];

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const isLastSentence = i === sentences.length - 1;

        if (isLastSentence) {
            currentParagraph += sentence + " "; // No dot after the last sentence
        } else if (currentParagraph.length + sentence.length + 2 <= MIN_LENGTH) {
            currentParagraph += sentence + ". ";
        } else {
            paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
            currentParagraph = sentence + ". ";
        }
    }

    if (currentParagraph) {
        paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
    }

    return paragraphs;
  }