<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';

class Users extends REST_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function login_post()
    {
        $data = $this->input->post();
        
        $result = $this->db->get_where('users', ['username' => $data['username'], 'password' => $data['password']])->row_array();

        if($result)
            $this->response($result, REST_Controller::HTTP_OK);
        else
            $this->response('error', REST_Controller::HTTP_OK);
    }

    public function getUsers_get()
    {
        $id = $this->uri->segment(4);

        if(!empty($id)){
            $data = $this->db->get_where('users', ['id' => $id])->row_array();
        }else{
            $data = $this->db->get('users')->result();
        }

        if(!$data)
            $data = 'No hay registros con este ID.';

        $this->response($data, REST_Controller::HTTP_OK);
    }

    public function insertUsers_post()
    {
        $data = $this->input->post();

        if($this->db->insert('users', $data))
            $this->response('Item creado con éxito.', REST_Controller::HTTP_OK); 
    }

    public function updateUsers_post()
    {
        $id = $this->input->post('id');
        $data = $this->input->post();

        if($this->db->update('users', $data, array('id'=>$id)))
            $this->response('Item actualizado con éxito.', REST_Controller::HTTP_OK);
    }

    public function deleteUsers_get()
    {
        $id = $this->uri->segment(4);

        if($this->db->delete('users', array('id'=>$id)))
            $this->response('Item eliminado con éxito.', REST_Controller::HTTP_OK);
    }
}