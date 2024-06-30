import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import { TextField, Button, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://35.202.78.230:5000/api/todos', {
          headers: { 'x-auth-token': token }
        });
        setTodos(response.data);
      } catch (err) {
        console.error('Failed to fetch todos:', err.response ? err.response.data : err.message);
      }
    };

    fetchTodos();
  }, [navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://35.202.78.230:5000/api/todos', { text: newTodo }, {
          headers: { 'x-auth-token': token }
        });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (err) {
        console.error('Failed to add todo:', err.response ? err.response.data : err.message);
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const todo = todos.find(todo => todo.id === id);
      const response = await axios.put(`http://35.202.78.230:5000/api/todos/${id}`, {
        text: todo.text,
        completed: !todo.completed
      }, {
        headers: { 'x-auth-token': token }
      });
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    } catch (err) {
      console.error('Failed to update todo:', err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://35.202.78.230:5000/api/todos/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err.response ? err.response.data : err.message);
    }
  };

  const handleEditTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setEditingTodo(id);
    setEditingText(todo.text);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (editingText.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://35.202.78.230:5000/api/todos/${editingTodo}`, {
          text: editingText,
          completed: todos.find(todo => todo.id === editingTodo).completed
        }, {
          headers: { 'x-auth-token': token }
        });
        setTodos(todos.map(todo => (todo.id === editingTodo ? { ...todo, text: editingText } : todo)));
        setEditingTodo(null);
        setEditingText('');
      } catch (err) {
        console.error('Failed to update todo:', err.response ? err.response.data : err.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <Paper className="todo-list-container" elevation={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h2">
          Todo List
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleOpenLogoutDialog}>
          Logout
        </Button>
      </Box>
      <form onSubmit={handleAddTodo} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField 
          label="New Todo" 
          variant="outlined" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          fullWidth
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Add Todo
        </Button>
      </form>
      {editingTodo !== null && (
        <form onSubmit={handleUpdateTodo} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <TextField 
            label="Edit Todo" 
            variant="outlined" 
            value={editingText} 
            onChange={(e) => setEditingText(e.target.value)} 
            fullWidth
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setEditingTodo(null)}>
            Cancel
          </Button>
        </form>
      )}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDeleteTodo} 
            onEdit={handleEditTodo} 
          />
        ))}
      </ul>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default TodoList;
