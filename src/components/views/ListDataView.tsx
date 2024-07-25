import { Component } from "solid-js";
import { DataState } from "../../state";
import ObjectList from "../ObjectList";

type Props = {
	z: DataState;
};

const ListDataView: Component<Props> = props => {
	return <ObjectList data={props.z.d().data} />;
};

export default ListDataView;
