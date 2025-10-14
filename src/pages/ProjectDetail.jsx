import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    fetchProjectDetail,
    clearProjectDetail,
} from "../redux/action/developerProjectAction";
import Layout from "../components/common/layout/Index";
import Breadcrumb from "../components/common/Breadcrumb";
import Gallery from "../components/partials/property-details/Gallery";
import Details from "../components/developerProject/projectDetail/Details";
import Shimmer from "../components/common/shimmer/Shimmer";
import { toast } from "react-toastify";
import useTranslationHook from "../components/hooks/useTranslationHook";
const ProjectDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: project_id } = useParams();
    const projectDetail = useSelector((state) => state.project.projectDetail);
    const lang = useSelector((state) => state.translation.lang);

    const { t } = useTranslationHook();

    useEffect(() => {
        if (!project_id || isNaN(Number(project_id))) {
            toast.error(t("Invalid project id"));
            return navigate("/not-found");
        }
        dispatch(clearProjectDetail());
        dispatch(fetchProjectDetail({ project_id }));
        //eslint-disable-next-line
    }, [project_id]);
    return (
        <React.Fragment>
            <Helmet>
                <meta
                    name="keywords"
                    content={t(
                        "Bidhome-Adres, CRE, brokers, investment, commercial real estate, sales, auction"
                    )}
                />
                <meta
                    name="description"
                    content={t(
                        "Bidhome-Adres brings buyers, sellers, and brokers together to efficiently market and close commercial real estate deals in online CRE auctions."
                    )}
                />
                <title>{t("Property Auction - Project Details")}</title>
            </Helmet>
            <Layout>
                {projectDetail?.id !== undefined ? (
                    <>
                        <Breadcrumb
                            links={[
                                { url: "/", name: t("Home") },
                                { url: "/projects", name: t("Projects") },
                                {
                                    url: "",
                                    name:
                                        lang === "en"
                                            ? projectDetail?.project_name
                                            : projectDetail?.project_name_ar ||
                                              "",
                                },
                            ]}
                        />
                        <Gallery images={projectDetail?.project_photo || []} />
                        <Details details={projectDetail} />
                    </>
                ) : (
                    <>
                        {[
                            {
                                type: "rectangle",
                                width: "90%",
                                height: "50vh",
                                borderRadius: "2%",
                                margin: "5% 0% 2% 5%",
                            },
                            {
                                type: "line",
                                width: "90%",
                                height: "6vh",
                                borderRadius: "2%",
                                margin: "0 0 0 5%",
                            },
                            {
                                type: "line",
                                width: "90%",
                                height: "6vh",
                                borderRadius: "2%",
                                margin: "0 0 4% 5%",
                            },
                        ].map((shimmerProps, index) => (
                            <Shimmer
                                key={index}
                                type={shimmerProps.type}
                                width={shimmerProps.width}
                                height={shimmerProps.height}
                                borderRadius={shimmerProps.borderRadius}
                                margin={shimmerProps.margin}
                            />
                        ))}
                    </>
                )}
            </Layout>
        </React.Fragment>
    );
};

export default ProjectDetail;
