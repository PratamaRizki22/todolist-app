import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function TodoItem({ todo, onToggleComplete, onDelete, onEdit }) {
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(todo.id)}>
            <Edit />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo.id)}>
            <Delete />
          </IconButton>
        </>
      }
      button
      onClick={() => onToggleComplete(todo.id)}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    >
      <ListItemText primary={todo.text} />
    </ListItem>
  );
}

export default TodoItem;
