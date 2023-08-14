import Message from "../layout/Message"
import { useLocation } from "react-router-dom"
import Container from '../layout/Container'
import styles from './Projects.module.css'
import LinkButton from "../layout/LinkButton"

function Projects() {
    const location = useLocation()
    let message = ''
    
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
                <p>Projetos...</p>
            </Container>
        </div>
    )
}

export default Projects