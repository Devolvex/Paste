// Save document
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      document.getElementById('submit').click();
    }
});

// New document
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      document.location.href = '/new';
    }
});

// Duplicate
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      document.location.href = '/new';
    }
});

// Raw document
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'r') {
      e.preventDefault();
      document.location.href = '/raw';
    }
});