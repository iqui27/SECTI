import os
import pandas as pd
from flask import Flask, request, render_template, flash, redirect, url_for
from werkzeug.utils import secure_filename

# Importar as funções enviar_email e criar_link_personalizado do seu script
from emailteste import enviar_email
from emailteste import criar_link_personalizado

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'your_secret_key'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('Nenhum arquivo selecionado')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('Nenhum arquivo selecionado')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            data = pd.read_csv(file_path)
            return render_template('dashboard.html', data=data.to_html(classes='table table-striped'), filename=filename)

    return render_template('upload.html')

@app.route('/enviar_emails/<filename>', methods=['POST'])
def send_emails(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    data = pd.read_csv(file_path)

    # Suponha que as colunas da planilha CSV sejam 'nome', 'email' e 'voucher'
    total_emails = len(data)
    for index, row in data.iterrows():
        enviar_email(row['nome'], row['email'], row['voucher'])
        progress = (index + 1) / total_emails * 100
        print(f'Progresso: {progress}%')

    flash('E-mails enviados com sucesso!')
    return redirect(url_for('upload_file'))

if __name__ == '__main__':
    app.run(debug=True)
