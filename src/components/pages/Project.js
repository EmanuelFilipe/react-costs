import { useParams } from 'react-router-dom'
import {useState, useEffect} from 'react'
import { parse, v4 as uuidv4 } from 'uuid'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import styles from './Project.module.css'
import ProjectForm from '../projects/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project() {
    //obtendo o id que veio por parâmetro pela url
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        // simulação de carregamento do Loading
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch((error) => console.error(error))
        }, 1000);
    }, [id])

    function editPost(project) {
        // OBS: precisa limpar a mensagem, pois se alterar varias vezes e a mensagem for a mesma o 
        // react nao exibe, por se tratar da mesma mensagem
        setMessage('')

        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false;
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(project)
            })
            .then((resp) => resp.json())
            .then((data) => {
                // atualiza o projeto
                setProject(data)
                setShowProjectForm(false)
                setMessage('Projeto atualizado!')
                setType('success')
            })
            .catch((error) => console.error(error))
    }

    function createService(project) {
        debugger
        //last service
        const lastService = project.services[project.services.length - 1]
        
        //gera um novo id
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        //maximum value validation
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        // add service cost to project total cost
        project.cost = newCost

        //update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setType('success')
            setMessage('Serviço adicionado com sucesso!')
            setServices(data.services)            
            setShowServiceForm(false)
        })
        .catch(error => console.error(error))        
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function removeService(id, cost) {
        const serviceUpdated = project.services.filter(
            (service) => service.id !== id)
        
        const projectUpdated = project

        projectUpdated.services = serviceUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
         //update project
         fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then(() => {
            setProject(projectUpdated)
            setServices(serviceUpdated)
            setType('success')
            setMessage('Serviço removido com sucesso!')
        })
        .catch(error => console.error(error)) 
    }


    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar' }
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Categoria: </span>{project.category.name}</p>
                                    <p><span>Total de Orçamento: </span> R${project.budget}</p>
                                    <p><span>Total Utilizado: </span> R${project.cost}</p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm 
                                        handleSubmit={editPost}
                                        btnText="Concluir Edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço: </h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar' }
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                            <h2>Serviços</h2>
                            <Container customClass="start">
                                {services.length > 0 && (
                                    services.map((service) => (
                                        <ServiceCard 
                                            id={service.id}
                                            key={service.id}
                                            name={service.name}
                                            cost={service.cost}
                                            description={service.description}
                                            handleRemove={removeService}
                                        />
                                    ))
                                )}
                                {services.length === 0 && (
                                    <p>Não há serviços cadastrados</p>
                                )}
                            </Container>
                    </Container> 
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Project