from flask import Flask
from flask.templating import render_template

app = Flask(__name__)
config = {
    "DEBUG": True
}
app.config.update(config)


@app.route("/")
def overview():
    output = render_template(
        "overview.html"
    )
    return output
@app.route("/overview")
def tournamentOverview():
    output = render_template(
        "tournamentOverview.html"
    )
    return output
@app.route("/config")
def tournamentConfig():
    output = render_template(
        "tournamentConfig.html"
    )
    return output
@app.route("/info")
def tournamentInformation():
    output = render_template(
        "tournamentInformation.html"
    )
    return output
@app.route("/tableSetup")
def tableSetup():
    output = render_template(
        "tableSetup.html"
    )
    return output
@app.route("/tournamentPlayer")
def tournamentPlayer():
    output = render_template(
        "tournamentPlayer.html"
    )
    return output

app.run(host='0.0.0.0')
