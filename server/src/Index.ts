

import * as http from 'http';
import TodoApp from './App';

class Index{

    onStart() : void {
        const port =  3000;
        TodoApp.set('port', port);

        //create a server and pass our Express app to it.
        const server = http.createServer(TodoApp);
        server.listen(port);
        server.on('listening', function(){
            console.log(`Listening on port `+ port);
        });
    }
}

var index = new Index();
index.onStart();