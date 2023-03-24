import base64
import os
import pickle
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Configuração da API do Gmail
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
creds = None
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)

if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)

    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

gmail_service = build('gmail', 'v1', credentials=creds)

# Banco de dados simulado
db = [
    {'nome': 'Fulano', 'email': 'fulano@email.com', 'voucher': '12345'},
    {'nome': 'Ciclano', 'email': 'ciclano@email.com', 'voucher': '67890'},
    {'nome': 'Beltrano', 'email': 'beltrano@email.com', 'voucher': '54321'},
]

def criar_link_personalizado(voucher):
    url_base = f'https://brasil.campus-party.org/cpbsb5/ingressos/?voucher={voucher}'
    return url_base

def enviar_email(nome, para_email, voucher):
    msg = MIMEMultipart()
    msg['To'] = para_email
    msg['Subject'] = 'Assunto do e-mail'
    
    link_personalizado = criar_link_personalizado(voucher)
    corpo_email = f"""Olá {nome},

Este é um exemplo de e-mail enviado usando Python e Gmail API.

Clique no link abaixo para resgatar seu voucher:

{link_personalizado}

Atenciosamente,
Seu nome"""
    msg.attach(MIMEText(corpo_email, 'plain'))

    raw_msg = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')

    try:
        gmail_service.users().messages().send(
            userId='me',
            body={'raw': raw_msg}
        ).execute()

        print(f'E-mail enviado para {nome} ({para_email}) com sucesso!')
    except Exception as e:
        print(f'Erro ao enviar e-mail para {nome} ({para_email}): {e}')

for contato in db:
    enviar_email(contato['nome'], contato['email'], contato['voucher'])
