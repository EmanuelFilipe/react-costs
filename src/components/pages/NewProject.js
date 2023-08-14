import ProjectForm from '../projects/ProjectForm'
import { useNavigate } from 'react-router-dom'
import styles from './NewProject.module.css'

function NewProject() {

    //permite fazer redirect nas paginas do sistemas
    const history = useNavigate()

    function createPost(project) {
        // initialize cost and services
        project.cost = 0
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // mandando dados para o servidor
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            //realiza um push no db.json/projects
            history('/projects', {state: {message: 'Projeto criado com sucesso!'}})
        })
        .catch((error) => console.error(error))
    }
    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    )
}

export default NewProject