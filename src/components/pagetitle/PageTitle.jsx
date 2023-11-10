import { Link } from 'react-router-dom';

import './styles.scss'


function PageTitle(props) {


    const { sub } = props;
    const { title } = props;
    return (
        <>
            <section className="tf-page-title">
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">

                            <ul className="breadcrumbs">
                                <li><Link to="/">Home</Link></li>
                                {sub && <li><Link to="/explore">{sub}</Link></li>}
                                <li>{title}</li>
                            </ul>

                            <h4 className="page-title-heading">{title}</h4>

                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

export default PageTitle;