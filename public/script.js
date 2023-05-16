document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      document.getElementById('submit').click();
    }
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      document.location.href = '/new';
    }
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      document.location.href = '/new';
    }
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'r') {
      e.preventDefault();
      document.location.href = '/raw';
    }
});