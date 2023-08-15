import Message from "../layout/Message"
import { useLocation } from "react-router-dom"
import Container from '../layout/Container'
import styles from './Projects.module.css'
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../projects/ProjectCard"
import { useState, useEffect } from "react"

function Projects() {
    const [projects, setProjects] = useState([])

    const location = useLocation()
    let message = ''
    
    useEffect(() => {
        fetch("http://localhost:5000/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setProjects(data)
        })
        .catch(error => console.error(error))
    }, [])


    // obtem o valor da mensagem enviado pelo componente NewProject
    if(location.state) {
        //message é o nome do objeto que esta recebendo o texto no componente NewProject
        message = location.state.message
    }
    
    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message type="success" msg={message} />}
            <Container customClass="start">
                {projects.length > 0 && 
                    projects.map((project) => (
                        <ProjectCard 
                         key={project.id}
                         id={project.id}                        
                         name={project.name}
                         budget={project.budget}
                         category={project?.category?.name}
                        />
                    ))
                }
            </Container>
        </div>
    )
}

export default Projects