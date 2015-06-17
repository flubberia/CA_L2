from bottle import *
import cgi, cgitb
cgitb.enable()

sent_parts = []
free_parts = []
sent_parts_without_deleting = []
received_parts = []
all_palindromes = []
n = 100
finished = []
start_time = 0
finish_time = 0
part = 100
file = open('text.txt', 'r')
text = file.read()
file.close()
pause_server = False



@get('/js/:filename#.*#')
def send_static(filename):
    return static_file(filename, root='./js')

@get('/')
def worker():
    return static_file('worker.html', root='.')

@get('/server')
def server():
    return static_file('server.html', root='.')

@get('/serverData')
def worker_get():
    number_of_clients = len(sent_parts) - len(received_parts)
    percents = len(received_parts)
    if part == percents:
        global all_palindromes
        return {'number_of_clients': number_of_clients,
                'percents': percents, 'results': all_palindromes,
                'time': finish_time - start_time}
    elif number_of_clients == 0:
        return {'number_of_clients': number_of_clients,
                'percents': percents, 'results': '-1',
                'time': 0}
    else:
        return {'number_of_clients': number_of_clients,
                'percents': percents, 'results': all_palindromes,
                'time': time.time() - start_time}


@post('/serverData')
def server_post():
    data = list(request.POST.dict.keys())[0]
    global pause_server, sent_parts, received_parts, start_time
    if data == 'pause':
        pause_server = True
    elif data == 'resume':
        pause_server = False
    elif data == 'restart':
        pause_server = False
        sent_parts = []
        received_parts = []
        start_time = 0

@get('/workerData')
def worker_get():
    if pause_server:
        return {'state': 'pause', 'text': '', 'worker_number': -1}

    global start_time
    if start_time == 0:
        start_time = time.time()

    for i in range(1, part + 1):
        if i not in sent_parts and i not in received_parts:
            sent_parts.append(i)
            worker_text = text[int((len(text) - n) * (i - 1) /
                               part): int((len(text) - n) * i / part + n)]
            return {'state': 'work', 'text': worker_text, 'worker_number': i}

    for i in range(1, part + 1):
        if i not in received_parts:
            worker_text = text[int((len(text) - n) *
                               (i - 1) / part): int((len(text) - n) * i / part + n)]
            return {'state': 'work', 'text': worker_text, 'worker_number': i}

    return {'state': 'stop', 'text': '', 'worker_number': 0}


@post('/workerData')
def worker_post():

    worker_number = request.forms.get('worker_number')
    palindromes = request.forms.get('palindromes')

    if int(worker_number) not in received_parts\
            and int(worker_number) in sent_parts:
        received_parts.append(int(worker_number))

    global all_palindromes
    for i in palindromes.split(','):
        if i not in all_palindromes:
            all_palindromes.append(i)

# last worker finished work
    if len(received_parts) == part:
        global finish_time
        finish_time = time.time()

if __name__ == "__main__":
    run(host='localhost', port=53897, debug=True)