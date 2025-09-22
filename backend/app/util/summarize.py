# import spacy
# from flask import jsonify, request
# from collections import Counter
# import re

# import os
# from pymongo import MongoClient
# mongo_client = MongoClient(os.getenv("MONGOURL"))
# db = mongo_client["cordis_db"]
# projects_collection = db["projects"]
# organizations_collection = db["organizations"]

# # Initialize spaCy model
# try:
#     nlp = spacy.load("en_core_web_sm")
#     print("✅ spaCy model loaded successfully")
# except OSError:
#     print("❌ spaCy model not found. Please install it with: python -m spacy download en_core_web_sm")
#     nlp = None

# def extract_project_keywords(project):
#     """Extract and normalize keywords from project's keyword field and text content."""
#     keywords = set()

#     # 1. Use existing keywords field (most important)
#     if project.get("keywords"):
#         project_keywords = project["keywords"]
#         if isinstance(project_keywords, str):
#             # Split by common delimiters
#             raw_keywords = re.split(r'[,;|\n]+', project_keywords)
#             for keyword in raw_keywords:
#                 cleaned = keyword.strip().lower()
#                 if len(cleaned) > 2:  # Filter out very short words
#                     keywords.add(cleaned)
#         elif isinstance(project_keywords, list):
#             for keyword in project_keywords:
#                 if isinstance(keyword, str):
#                     cleaned = keyword.strip().lower()
#                     if len(cleaned) > 2:
#                         keywords.add(cleaned)

#     # 2. Extract from title and objective using NLP (if available)
#     if nlp:
#         text_content = ""
#         if project.get("title"):
#             text_content += project["title"] + " "
#         if project.get("objective"):
#             # Take first 500 chars to avoid processing very long texts
#             text_content += project["objective"][:500]

#         if text_content:
#             try:
#                 doc = nlp(text_content)
#                 # Extract meaningful entities and noun phrases
#                 for ent in doc.ents:
#                     if ent.label_ in ["PRODUCT", "TECHNOLOGY", "ORG", "EVENT", "WORK_OF_ART"]:
#                         cleaned = ent.text.lower().strip()
#                         if len(cleaned) > 2:
#                             keywords.add(cleaned)

#                 # Extract key noun phrases (2-4 words)
#                 for chunk in doc.noun_chunks:
#                     if 2 <= len(chunk.text.split()) <= 4:
#                         cleaned = chunk.text.lower().strip()
#                         if len(cleaned) > 5:  # Longer phrases only
#                             keywords.add(cleaned)

#             except Exception as e:
#                 print(f"Error in NLP keyword extraction: {e}")

#     return list(keywords)

# def get_trending_keywords(limit=50):
#     """Get most common keywords across all projects."""
#     try:
#         # Aggregate keywords from all projects
#         pipeline = [
#             {"$match": {"keywords": {"$exists": True, "$ne": None}}},
#             {"$project": {"keywords": 1, "title": 1, "objective": 1}},
#             {"$limit": 1000}  # Process reasonable number of projects
#         ]

#         projects = list(db.projects.aggregate(pipeline))
#         all_keywords = []

#         for project in projects:
#             keywords = extract_project_keywords(project)
#             all_keywords.extend(keywords)

#         # Count frequency and return top keywords
#         keyword_counter = Counter(all_keywords)
#         return [{"keyword": k, "count": v} for k, v in keyword_counter.most_common(limit)]

#     except Exception as e:
#         print(f"Error getting trending keywords: {e}")
#         return []

# def get_keyword_suggestions(query, limit=10):
#     """Get keyword suggestions based on partial query."""
#     try:
#         if len(query) < 2:
#             return []

#         # Use text search on keywords field
#         search_pipeline = [
#             {
#                 "$match": {
#                     "$or": [
#                         {"keywords": {"$regex": query, "$options": "i"}},
#                         {"title": {"$regex": query, "$options": "i"}}
#                     ]
#                 }
#             },
#             {"$project": {"keywords": 1, "title": 1}},
#             {"$limit": 100}
#         ]

#         projects = list(db.projects.aggregate(search_pipeline))
#         suggestions = set()

#         for project in projects:
#             keywords = extract_project_keywords(project)
#             for keyword in keywords:
#                 if query.lower() in keyword.lower():
#                     suggestions.add(keyword)
#                     if len(suggestions) >= limit:
#                         break
#             if len(suggestions) >= limit:
#                 break

#         return sorted(list(suggestions))

#     except Exception as e:
#         print(f"Error getting keyword suggestions: {e}")
#         return []

# def enhanced_project_search(search_params):
#     """Enhanced search using project keywords and NLP."""
#     query = {}

#     # Text search
#     if search_params.get("q"):
#         search_term = search_params["q"]
#         query["$or"] = [
#             {"title": {"$regex": search_term, "$options": "i"}},
#             {"objective": {"$regex": search_term, "$options": "i"}},
#             {"keywords": {"$regex": search_term, "$options": "i"}},
#             # Add coordinator name search
#             {"coordinator.name": {"$regex": search_term, "$options": "i"}}
#         ]

#     # Keyword-specific search
#     if search_params.get("keywords"):
#         keywords = search_params["keywords"].split(",")
#         keyword_conditions = []
#         for keyword in keywords:
#             keyword = keyword.strip()
#             keyword_conditions.append(
#                 {"keywords": {"$regex": keyword, "$options": "i"}}
#             )
#         if keyword_conditions:
#             if "$or" in query:
#                 query["$and"] = [{"$or": query["$or"]}, {"$or": keyword_conditions}]
#             else:
#                 query["$or"] = keyword_conditions

#     return query

# def summarize_objective(objective_text, max_sentences=3):
#     """Enhanced summarization using both NLP and project-specific keywords."""
#     if not objective_text or not nlp:
#         return None

#     try:
#         doc = nlp(objective_text)
#         sentences = list(doc.sents)

#         if len(sentences) <= max_sentences:
#             return objective_text

#         # Enhanced keywords specific to EU research projects
#         eu_keywords = [
#             # Core objectives
#             "aims", "objective", "goal", "purpose", "mission", "vision",
#             # Actions
#             "develop", "create", "improve", "enhance", "support", "promote",
#             "address", "focus", "target", "seek", "investigate", "explore",
#             "implement", "establish", "facilitate", "deliver", "provide",
#             # EU-specific terms
#             "innovation", "research", "technology", "sustainability", "digital",
#             "climate", "environment", "health", "security", "mobility",
#             "energy", "agriculture", "education", "society", "economy",
#             # Impact words
#             "impact", "benefit", "solution", "challenge", "opportunity",
#             "transformation", "advancement", "breakthrough", "excellence"
#         ]

#         scored = []
#         for i, sent in enumerate(sentences):
#             score = 0
#             sent_text = sent.text.lower()

#             # Keyword matching
#             score += sum(2 if word in sent_text else 0 for word in eu_keywords)

#             # Position bonus (first sentences often contain main objectives)
#             if i == 0:
#                 score += 5
#             elif i == 1:
#                 score += 3

#             # Length penalty for very short or very long sentences
#             word_count = len(sent.text.split())
#             if 10 <= word_count <= 30:
#                 score += 1

#             # Entity bonus (using spaCy NER)
#             entities = [ent.label_ for ent in sent.ents]
#             if any(label in entities for label in ["PRODUCT", "TECHNOLOGY", "ORG"]):
#                 score += 2

#             scored.append((score, sent.text.strip()))

#         # Sort by score and take top sentences
#         scored.sort(key=lambda x: x[0], reverse=True)
#         top_sentences = [s for _, s in scored[:max_sentences]]

#         # Maintain original order for readability
#         original_order = []
#         for sent in sentences:
#             if sent.text.strip() in top_sentences:
#                 original_order.append(sent.text.strip())
#                 if len(original_order) == max_sentences:
#                     break

#         return " ".join(original_order)

#     except Exception as e:
#         print(f"Error in enhanced summarization: {str(e)}")
#         return None

# # New API endpoints
# @projects_bp.route("/keywords/trending", methods=["GET"])
# def get_trending_keywords_endpoint():
#     """Get most popular keywords across projects."""
#     try:
#         limit = min(int(request.args.get("limit", 50)), 100)
#         keywords = get_trending_keywords(limit)
#         return jsonify({
#             "keywords": keywords,
#             "total": len(keywords)
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @projects_bp.route("/keywords/suggestions", methods=["GET"])
# def get_keyword_suggestions_endpoint():
#     """Get keyword suggestions for autocomplete."""
#     try:
#         query = request.args.get("q", "")
#         limit = min(int(request.args.get("limit", 10)), 20)
#         suggestions = get_keyword_suggestions(query, limit)
#         return jsonify({
#             "suggestions": suggestions,
#             "query": query
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @projects_bp.route("/<project_id>/keywords", methods=["GET"])
# def get_project_keywords_endpoint(project_id):
#     """Get extracted keywords for a specific project."""
#     try:
#         project = db.projects.find_one({"id": project_id})
#         if not project:
#             return jsonify({"error": "Project not found"}), 404

#         keywords = extract_project_keywords(project)
#         return jsonify({
#             "project_id": project_id,
#             "keywords": keywords,
#             "total": len(keywords)
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Enhanced search endpoint
# @projects_bp.route("/search/enhanced", methods=["GET"])
# def enhanced_search():
#     """Enhanced search with better keyword matching."""
#     try:
#         # Get search parameters
#         search_params = {
#             "q": request.args.get("q", ""),
#             "keywords": request.args.get("keywords", ""),
#             # Add other existing filters
#             "programme": request.args.get("programme", ""),
#             "status": request.args.get("status", ""),
#             # ... other filters
#         }

#         # Build query
#         query = enhanced_project_search(search_params)

#         # Execute search with pagination
#         page = int(request.args.get("page", 1))
#         per_page = min(int(request.args.get("per_page", 20)), 50)
#         skip = (page - 1) * per_page

#         # Get total count
#         total = db.projects.count_documents(query)

#         # Get projects
#         projects = list(db.projects.find(query).skip(skip).limit(per_page))
#         projects = [convert_objectid(project) for project in projects]

#         # Enrich with keywords
#         for project in projects:
#             project["extracted_keywords"] = extract_project_keywords(project)[:10]  # Top 10

#         return jsonify({
#             "projects": projects,
#             "pagination": {
#                 "page": page,
#                 "per_page": per_page,
#                 "total": total,
#                 "pages": (total + per_page - 1) // per_page
#             },
#             "search_params": search_params
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
