# Flash
O flash é utilizado dentro da aplicação para gerar mensagens para o usuário durante o redirecionamento de páginas. 
Na aplicação, ele pode ser utilizado como: 
```python
flash('[Mensagem para o usuário]', category='[error/success]')
```
\
No HTML, ele pode ser inserido com:

```html
{% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        {% for category, message in messages %}
            <div class="alert alert-{{ category }}">
                {{ message }}
            </div>
        {% endfor %}
    {% endif %}
{% endwith %}
```
ps.: Não precisa de alteração.
