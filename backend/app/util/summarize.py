import spacy

nlp = spacy.load("en_core_web_sm")


def summarize_objective(objective_text, max_sentences=4):
    if not objective_text:
        return []

    doc = nlp(objective_text)
    sentences = list(doc.sents)

    # Define keywords to look for (you can expand this list)
    keywords = ["develop", "support", "improve",
                "create", "increase", "enhance", "promote"]

    scored = []
    for sent in sentences:
        score = sum(1 for word in keywords if word in sent.text.lower())
        scored.append((score, sent.text.strip()))

    # Sort by score (highest first), then take top N
    scored.sort(key=lambda x: x[0], reverse=True)
    top_sentences = [s for _, s in scored[:max_sentences]]

    return top_sentences


# objective = """The project aims to develop innovative AI technologies for healthcare.
# It will support hospitals across Europe by improving diagnostics and treatment.
# The project also seeks to promote collaboration among universities.
# Additionally, it will create new training programs for young researchers."""

# print(summarize_objective(objective))
