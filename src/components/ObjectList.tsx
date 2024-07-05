import { Component, For, Match, Switch, mergeProps } from "solid-js";
import { RawData } from "../data-type";

type Props = {
	data: RawData;
	depth?: number;
};

const ObjectList: Component<Props> = _props => {
	const props = mergeProps({ depth: 0 }, _props);

	return (
		<Switch>
			<Match when={props.depth > 100}>
				<code>...</code>
			</Match>
			<Match when={Array.isArray(props.data)}>
				<ol>
					<For each={props.data as RawData[]}>
						{item => (
							<li>
								<ObjectList data={item} depth={props.depth + 1} />
							</li>
						)}
					</For>
				</ol>
			</Match>
			<Match when={props.data instanceof Map}>
				<ul>
					<For
						each={Array.from((props.data as Map<string, RawData>).entries())}>
						{([key, value]) => (
							<li>
								<b>{key}</b>:{" "}
								<ObjectList data={value} depth={props.depth + 1} />
							</li>
						)}
					</For>
				</ul>
			</Match>
			<Match
				when={
					props.data === true || props.data === false || props.data === null
				}>
				<b>{"" + props.data}</b>
			</Match>
			<Match when={typeof props.data === "number"}>{"" + props.data}</Match>
			<Match when={typeof props.data === "string"}>
				<code>{props.data as string}</code>
			</Match>
		</Switch>
	);
};

export default ObjectList;
