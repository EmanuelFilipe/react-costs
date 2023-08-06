import styles from './Container.module.css'

function Container(props) {
    //${styles[props.customClass]}` renderizando uma classe que vem atraves da props
    // enviado pelo componente pai 
    return (
        <div className={`${styles.container} ${styles[props.customClass]}`}>{props.children}</div>
    )
}

export default Container