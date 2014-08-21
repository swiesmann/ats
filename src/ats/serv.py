from flask import Flask
from flask.templating import render_template

app = Flask(__name__)
config = {
    "DEBUG": True
}
app.config.update(config)


@app.route("/")
def hello_word():
    output = render_template(
        "index.html"
    )
    return output
app.run(host='0.0.0.0')
