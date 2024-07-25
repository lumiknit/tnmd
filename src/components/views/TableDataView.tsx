import {
	Component,
	createEffect,
	createSignal,
	For,
	Match,
	Show,
	Switch,
} from "solid-js";
import { DataState } from "../../state";
import ObjectList from "../ObjectList";
import { RawData } from "../../data-type";

import "./TableDataView.scss";

type TableData = {
	headers: string[];
	rows: (RawData | undefined)[][];
};

const convertDataToTable = (v: RawData): TableData | undefined => {
	// Check if it is an array
	if (!Array.isArray(v)) return;

	const keys = new Set<string>();

	// Gather headers
	for (const entry of v) {
		// Entry must be map
		if (!(entry instanceof Map)) return;
		for (const key of entry.keys()) {
			keys.add(key);
		}
	}

	// Convert keys to array
	const headers = Array.from(keys);

	// Gather values
	const rows = v.map(entry => {
		const e = entry as Map<string, RawData>;
		const row: (RawData | undefined)[] = headers.map(key => e.get(key));
		return row;
	});

	return {
		headers,
		rows,
	};
};

type Props = {
	z: DataState;
};

const TableDataView: Component<Props> = props => {
	const [tableData, setTableData] = createSignal<TableData | undefined>();

	createEffect(() => {
		const d = props.z.d();
		const td = convertDataToTable(d.data);
		console.log(td);
		setTableData(td);
	});

	return (
		<Switch>
			<Match when={tableData() === undefined}>
				<div>
					{" "}
					Value cannot be interpreted as table (should be an array of objects){" "}
				</div>
			</Match>
			<Match when>
				<table class="tbl-data">
					<thead>
						<tr>
							<For each={tableData()!.headers}>
								{header => <th>{header}</th>}
							</For>
						</tr>
					</thead>
					<tbody>
						<For each={tableData()!.rows}>
							{row => (
								<tr>
									<For each={row}>
										{cell => (
											<td>
												<Show
													when={cell !== undefined}
													fallback={<span class="dimmed">.</span>}>
													<ObjectList data={cell!} />
												</Show>
											</td>
										)}
									</For>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</Match>
		</Switch>
	);
};

export default TableDataView;
