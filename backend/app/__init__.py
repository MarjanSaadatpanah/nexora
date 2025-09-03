from flask import Flask
from .extensions import db
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from app.routes.projects import projects_bp
    from app.routes.organizations import organizations_bp
    from app.routes.stats import stats_bp

    from app.util.summarize import summarize_objective
    objective = """Our business plan drives deep systemic transformational impact through innovation to tackle key challenges facing the agrifood sector today through four priorities: Missions-driven approach: Aligning with our three missions our plan directly addresses the complex and critical challenges of sustainability and climate change non-communicable diseases and poor nutrition and consumer trust scarcity and transparency. Designing for impact: Our calls seek out innovations with the most potential for systemic change. Through our new partnership and community we will bring together unique consortia who can accelerate innovation speeding-up and scaling-up solutions to market. Transforming our partnership around purpose: Our transformed partnership will have a depth of strategic expertise a core of delivery capability which will consistently bring innovation to market and a broad community providing insight energy and ideas. Market-ready innovation: We will create an ecosystem to accelerate market-ready innovation leveraging the pillars of knowledge triangle integration (Innovation Education and Business creation catalysed by Public Engagement) to create the foundations for the plan. Over the next three years we will deliver: a wealth of innovations to market trained students new start-ups and deep engagement with the people who are part of the whole food value chain from farm to fork. We will make a material difference to HALYS by enabling more consumers to make better choices through access to healthier products and actionable information. We will be closer to a net zero food system reducing CO2 equivalent emissions by tackling CO2 hotspots reducing the footprint of proteins through diversification and creating new markets for food waste. And we will see the benefits of more resilient trusted food supply chains with people experiencing greater food security and safety through widespread digitally enabled food supply chains."""
    print(summarize_objective(objective))

    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(organizations_bp, url_prefix="/api/organizations")
    app.register_blueprint(stats_bp, url_prefix="/stats")

    return app
