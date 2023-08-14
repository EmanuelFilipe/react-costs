import { useEffect, useState } from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

function ProjectForm({ btnText, handleSubmit, projectData }) {
    const [categories, setCategories] = useState([])
    // se tiver projectData o useState seta esse obj, senão irá inicializar um objeto vazio
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(resp => resp.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error))
    }, []) // o [] é o valor inicial desse hook

    // uma const que executa uma arrow-function
    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    }

    function handleChange(e) {
        // irá alterar o nome do projeto
        setProject({...project, [e.target.name]: e.target.value});
    }

    function handleCategory(e) {
        // irá alterar o nome do projeto
        setProject({
            ...project, 
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        });
    }
    
    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome do projeto" name="name" 
              placeholder="Insira o nome do projeto"
              handleOnChange={handleChange} 
              value={project.name ? project.name : ''}
            />
            <Input type="number" text="Orçamento do projeto" 
              name="budget" placeholder="Insira o orçamento total"
              handleOnChange={handleChange}
              value={project.budget ? project.budget : ''}
            />
            <Select name="category_id" text="Selecione a categoria" 
              options={categories} 
              handleOnChange={handleCategory} 
              value={project.category ? project.category.id : ''}
            />
            <SubmitButton text={btnText} />  
        </form>
    )
}

export default ProjectForm