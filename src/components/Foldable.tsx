import { Component, JSX, splitProps } from "solid-js";
import { randString } from "../data-type/helper";

type Props = {
	class?: string;
	title: string;
	children: JSX.Element;
} & JSX.HTMLAttributes<HTMLDivElement>;

const Foldable: Component<Props> = props => {
	const [customProps, divProps] = splitProps(props, [
		"title",
		"children",
		"class",
	]);

	const randomID = randString();
	const rootID = "accordion-" + randomID;
	const headerID = "hd-" + randomID;
	const collapseID = "collapse-" + randomID;

	return (
		<div
			{...divProps}
			class={"accordion " + (customProps.class ?? "")}
			id={rootID}>
			<div class="accordion-item">
				<h2 class="accordion-header" id={headerID}>
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target={"#" + collapseID}>
						{customProps.title}
					</button>
				</h2>
				<div
					id={collapseID}
					class="accordion-collapse collapse"
					data-bs-parent={"#" + rootID}>
					<div class="accordion-body">{customProps.children}</div>
				</div>
			</div>
		</div>
	);
};

export default Foldable;
