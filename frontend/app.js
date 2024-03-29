//var BaseApiUrl = "https://chopoweb.000webhostapp.com/lab3crud/index.php/api/"; //Api publicada funcional.
var BaseApiUrl = "http://192.168.8.103/AsignacionUno/backend/index.php/api/";
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
                id: '',
                username: '',
                password: '',
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
                comments: [],
                showCollapse: false
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
                        if(response.data === 'error') {
                            toastr.error("Error iniciando sesión");
                        } else{
                            this.user.id = response.data.id;
                            this.user.username = response.data.username;
                            this.user.image = response.data.image;
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
                this.user.image = '';
                this.clearPost();
            },
            search(){
                this.filteredPost = this.posts.filter(
                    data => data.text.toLowerCase().includes(this.post.text.toLowerCase()));
            },
            submitData(evt){
                evt.preventDefault();
                if(this.post.text){
                    if (this.post.id !== '') {
                        this.editData();
                    } else {
                        this.addData();                    
                    }
                } else {
                    toastr.error("Datos requeridos!");
                }
            },
            clearPost(){
                this.post.id = '';
                this.post.postid = null;
                this.post.userid = '';
                this.post.username = '';
                this.post.image = '';
                this.post.text = '';
                this.post.created_at = '';
                this.post.comments = [];
                this.post.showCollapse = false;
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
                if (this.post.postid)
                    formdata.append('postid',this.post.postid);
                axios.post(
                    buildUrl('posts/insertposts'), formdata
                ).then((response) => {
                    ws.send("add");
                    this.clearPost();
                    this.getData();
                    toastr.success("La publicación fue agregada con éxito");
                }).catch(error => {console.log(error)});
            },
            editData(){
                var formdata = new FormData();
                formdata.append('id',this.post.id);
                formdata.append('text',this.post.text);
                formdata.append('userid',this.user.id);
                if (this.post.postid)
                    formdata.append('postid',this.post.postid);
                axios.post(
                    buildUrl('posts/updateposts'), formdata
                ).then((response) => {
                    ws.send("update");
                    this.clearPost();
                    this.getData();
                    toastr.success("La publicación fue actualizada con éxito");
                }).catch(error => {console.log(error)});
            }, 
            getResponseData(id){
                this.post.postid = id;
                this.$refs.posttext.$el.focus();
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
                    this.$refs.posttext.$el.focus();
                }).catch(error => {console.log(error)});
            },
            MyWebSocketCall() {
                if ("WebSocket" in window) {
                    console.log("WebSocket is supported by your Browser!");
                    //wss://connect.websocket.in/YOUR_CHANNEL_ID?room_id=YOUR_ROOM_ID
                    ws = new WebSocket("wss://connect.websocket.in/nervinlicweb?room_id=9999");
                    ws.onopen = function() {
                        ws.send("open");
                        console.log("WebSocket is open...");
                    };
                    ws.onmessage = function (evt) {
                        vm.getData();
                        console.log("Message is received: " + evt.data);
                    };
                    ws.onclose = function() {
                        console.log("Connection is closed...");
                    };
                } else {
                    alert("WebSocket NOT supported by your Browser!");
                }
            }
        }
    });
}
function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onConfirm(buttonIndex) {
    if (buttonIndex==2){
        navigator.app.exitApp();
    }
}

function onBackKeyDown() {
    navigator.notification.confirm(
        '¿Está seguro que desea salir?',
        onConfirm,
        'Salir de myApp',
        'No,Sí'
    );
}