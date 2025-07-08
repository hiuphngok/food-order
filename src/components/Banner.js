import SidebarFilter from "./SidebarFilter"

const Banner = ({onFilterChange}) => {       
    return (
        <SidebarFilter onFilterChange={onFilterChange} />
    );
};
export default Banner;