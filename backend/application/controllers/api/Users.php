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
}