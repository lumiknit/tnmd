import { Component, For, Match, Switch, createEffect } from "solid-js";

import {
	Action,
	DataState,
	redoAction,
	restoreTo,
	undoAction,
} from "../../state";
import toast from "solid-toast";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbCircle,
	TbCircleFilled,
} from "solid-icons/tb";

const actionTypeColors = {
	changeType: "blue",
	changeStr: "green",
	parse: "yellow",
	stringify: "red",
};

const Circle: Component<{
	action: Action;
	old?: boolean;
}> = props => {
	return (
		<span
			style={{
				color: `var(--bs-${(actionTypeColors as any)[props.action.type] ?? "red"})`,
			}}>
			{props.old ? <TbCircleFilled /> : <TbCircle />}
		</span>
	);
};

const HistoryItem: Component<{
	id?: string;
	onClick: (e: MouseEvent) => void;
	action: Action;
	old?: boolean;
}> = props => {
	return (
		<div id={props.id} class="history-item" onClick={props.onClick}>
			<Circle {...props} />
			<span>
				<Switch>
					<Match when={props.action.type === "changeType"}>
						Type <code>{props.action.oldD.type}</code> →{" "}
						<code>{props.action.newD.type}</code>
					</Match>
					<Match when={props.action.type === "changeStr"}>
						Text (chars: {props.action.oldD.str.length} →{" "}
						{props.action.newD.str.length})
					</Match>
					<Match when={props.action.type === "parse"}>
						Parse string data as <code>{props.action.newD.type}</code>
					</Match>
					<Match when={props.action.type === "stringify"}>
						Stringify data as <code>{props.action.newD.type}</code>
					</Match>
					<Match when>{props.action.type}</Match>
				</Switch>
			</span>
		</div>
	);
};

type Props = {
	z: DataState;
};

const HistoryView: Component<Props> = props => {
	let historyItemsRef: HTMLDivElement;

	const handleUndo = () => {
		try {
			undoAction(props.z);
		} catch (e) {
			toast.error("Nothing to undo");
			console.warn(e);
		}
	};

	const handleRedo = () => {
		try {
			redoAction(props.z);
		} catch (e) {
			toast.error("Nothing to redo");
			console.warn(e);
		}
	};

	const handleItemClick = (idx: number) => (e: MouseEvent) => {
		// Check y
		const y = e.clientY;
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		const j = idx + (y > (rect.bottom + rect.top) / 2 ? 1 : 0);
		restoreTo(props.z, j);
	};

	createEffect(() => {
		const h = props.z.history();
		let item = document.getElementById("h-it-" + h.p);
		if (item === null) item = document.getElementById("h-it-" + (h.p - 1));

		if (item) {
			console.log(item, historyItemsRef);
			// Get the parent
			historyItemsRef!.scrollTo({
				top:
					item.offsetTop -
					historyItemsRef.offsetTop -
					historyItemsRef.offsetHeight / 2,
				behavior: "smooth",
			});
		}
	});

	return (
		<div class="history-box">
			<div class="input-group">
				<button
					class="btn btn-sm btn-primary d-flex align-items-center"
					onClick={handleUndo}>
					<TbArrowBackUp />
					Undo
				</button>
				<input
					type="text"
					class="form-control"
					disabled
					value={`${props.z.history().p} / ${props.z.history().actions.length}`}
				/>
				<button
					class="btn btn-sm btn-primary d-flex align-items-center"
					onClick={handleRedo}>
					<TbArrowForwardUp />
					Redo
				</button>
			</div>
			<div class="history-items" ref={historyItemsRef!}>
				<For each={props.z.history().actions}>
					{(action, idx) => (
						<HistoryItem
							id={"h-it-" + idx()}
							action={action}
							old={idx() < props.z.history().p}
							onClick={handleItemClick(idx())}
						/>
					)}
				</For>
			</div>
			<small>
				Click to <code>undo</code> or <code>redo</code> actions
			</small>
		</div>
	);
};

export default HistoryView;
