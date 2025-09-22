const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 5000

app.use(express.static(path.join(__dirname)))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () =>{
    console.log('Server is running on http://localhost:5000');
});