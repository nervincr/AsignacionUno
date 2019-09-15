var BaseApiUrl = "http://chopoweb.000webhostapp.com/lab3crud/index.php/api/";
var ws;

function buildUrl(service){
    return BaseApiUrl + service;
}

window.onload = function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    var vm = new Vue({
        el: '#app',
        data: {
            user: {
                /*id: '',
                username: '',
                password: ''*/
                id: '1',
                username: 'sebas',
                password: '123',
                image:''
            },
            post: {
                id: '',
                postid: null,
                userid: '',
                username: '',
                image: '',
                text: '',
                created_at: '',
                comments: []
            },
            posts: [],
            filteredPost: []
        },
        mounted(){
            this.getData();
            this.MyWebSocketCall();
        },
        methods:{
            getData(){
                axios.get(buildUrl('posts/getposts')).then((response) => {
                    this.posts = response.data;
                    this.search();
                }).catch(error => {console.log(error)});
            },
            submitLoginData(evt){
                evt.preventDefault();
                if((this.user.username) && (this.user.password)){
                    var formdata = new FormData();
                    formdata.append('username',this.user.username);
                    formdata.append('password',this.user.password);
                    axios.post(
                        buildUrl('users/login'), formdata
                    ).then((response) => {
                        //ws.send("add");
                        if(response.data === 'error') {
                            toastr.error("Error iniciando sesión");
                        } else{
                            this.user.id = response.data.id;
                            toastr.success("Logeado con éxito");
                        }
                        this.getData();
                    }).catch(error => {console.log(error)});   
                } else {
                    toastr.error("Datos requeridos!");
                }
            },
            logout(){
                this.user.id = '';
                this.user.username = '';
                this.user.password = '';
            },
            search(){
                this.filteredPost = this.posts.filter(
                    data => data.text.toLowerCase().includes(this.post.text.toLowerCase()) &&
                    data.postid === null
                );
            },
            submitData(evt){
                evt.preventDefault();
                if(this.post.text){
                    if (this.post.id !== '') {
                        this.editData();
                    } else {
                        this.addData();                    
                    }
                    this.cleanPost();
                } else {
                    toastr.error("Datos requeridos!");
                }
            },
            cleanPost(){
                this.post.id = '';
                this.post.postid = '';
                this.post.userid = '';
                this.username = '';
                this.post.text = '';
                this.post.image = '';
                this.post.created_at = '';
                this.comments = [];
            },
            deleteData(id){
                axios.get(buildUrl('posts/deleteposts/' + id)).then((response) => {
                    ws.send("delete");
                    this.getData();
                    toastr.success("La publicación fue eliminada con éxito");
                }).catch(error => {console.log(error)});
            },
            addData(){
                var formdata = new FormData();
                formdata.append('text',this.post.text);
                formdata.append('userid',this.user.id);
                axios.post(
                    buildUrl('posts/insertposts'), formdata
                ).then((response) => {
                    ws.send("add");
                    this.getData();
                    toastr.success("La publicación fue agregada con éxito");
                }).catch(error => {console.log(error)});
            },
            editData(){
                var formdata = new FormData();
                formdata.append('id',this.post.id);
                formdata.append('text',this.post.text);
                formdata.append('userid',this.user.id);
                axios.post(
                    buildUrl('posts/updateposts'), formdata
                ).then((response) => {
                    ws.send("update");
                    this.getData();
                    toastr.success("La publicación fue actualizada con éxito");
                }).catch(error => {console.log(error)});
            }, 
            getEditData(id){
                axios.get(buildUrl('posts/getposts/' + id)).then((response) => {
                    this.post.id = response.data.id;
                    this.post.postid = response.data.postid;
                    this.post.text = response.data.text;
                    this.post.userid = response.data.userid;
                    this.post.username = response.data.username;
                    this.post.comments = response.data.comments;
                    this.post.created_at = response.data.created_at;
                    this.post.image = response.data.image;
                }).catch(error => {console.log(error)});
            },
            MyWebSocketCall() {
                if ("WebSocket" in window) {
                    console.log("WebSocket is supported by your Browser!");
                    // Let us open a web socket
                    //personalizamos la url con nuestro propio room_id
                    //wss://connect.websocket.in/YOUR_CHANNEL_ID?room_id=YOUR_ROOM_ID
                    ws = new WebSocket("wss://connect.websocket.in/nervinlicweb?room_id=9999");
                    ws.onopen = function() {
                    // Web Socket is connected, send data using send()
                    ws.send("open");
                    console.log("WebSocket is open...");
                    };
                    ws.onmessage = function (evt) {
                    //cada vez que se invoca el ws.send() se recibe una respuesta de forma asincrónica
                    vm.getData();
                    console.log("Message is received: " + evt.data); //evt.data contiene el msj recibido
                    };
                    ws.onclose = function() {
                    // websocket is closed.
                    console.log("Connection is closed...");
                    };
                } else {
                    // The browser doesn't support WebSocket
                    alert("WebSocket NOT supported by your Browser!");
                }
            }
        }
      });
}
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onConfirm(buttonIndex) {
    if (buttonIndex==2){
        navigator.app.exitApp();
    }
}

// Handle the back button
//
function onBackKeyDown() {
    navigator.notification.confirm(
        '¿Está seguro que desea salir?',  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Salir de myApp',            // title
        'No,Sí'         // buttonLabels
    );
}