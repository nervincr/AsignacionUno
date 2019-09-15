<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';

class Posts extends REST_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function getPosts_get()
    {
        $id = $this->uri->segment(4);

        // Publicaciones
        $this->db->select('posts.id, posts.text, posts.created_at, posts.userid, posts.postid, users.username, users.image');
        $this->db->from('posts');
        $this->db->join('users', 'posts.userid = users.id');

        if(!empty($id)) {
            $this->db->where('posts.id', $id);
            $this->db->order_by('posts.id', 'ASC');
            $data = $this->db->get()->row_array();
        }
        else {
            $this->db->where('posts.postid', NULL);
            $this->db->order_by('posts.id', 'ASC');
            $data = $this->db->get()->result_array();

            // Comentarios
            foreach ($data as $key => $value) {
                $this->db->select('posts.id, posts.text, posts.created_at, posts.userid, posts.postid, users.username, users.image');
                $this->db->from('posts');
                $this->db->join('users', 'posts.userid = users.id');
                $this->db->where('posts.postid', $data[$key]['id']);
                $this->db->order_by('posts.id', 'ASC');
                $data[$key]['comments'] = $this->db->get()->result_array();
            }
        }

        $this->response($data);
    }

    public function insertPosts_post()
    {
        $data = $this->input->post();

        if($this->db->insert('posts', $data))
            $this->response($data, REST_Controller::HTTP_CREATED); 
    }

    public function updatePosts_post()
    {
        $id = $this->input->post('id');
        $data = $this->input->post();

        if($this->db->update('posts', $data, array('id'=>$id)))
            $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
    }

    public function deletePosts_get()
    {
        $id = $this->uri->segment(4);

        if($this->db->delete('posts', array('postid'=>$id)) &&
            $this->db->delete('posts', array('id'=>$id)))
            $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
    }
}