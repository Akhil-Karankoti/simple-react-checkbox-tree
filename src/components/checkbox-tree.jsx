import React, { useState, useEffect } from 'react';
import './styles/index.css';

function CustomCheckBox(props) {

    const [partialChecked, setPartialChecked] = useState([]);

    useEffect(() => {
        if (Object.keys(props).indexOf('expandAll') !== -1) {
            let expandedArray = [];
            props.expandAll && getExpandedArray(props.nodes, expandedArray);
            props.onExpand(expandedArray);
        }
    }, [props.expandAll, props.nodes])

    const handleChevron = (value, isOpen) => {
        let expanded = [...props.expanded]
        if (isOpen) {
            expanded.push(value);
        }
        else {
            let { valuesArray } = getAllChildrenValues(value);
            expanded = expanded.filter(value => !valuesArray.includes(value))
        }
        props.onExpand(expanded);
    }

    /**
     * @param {Boolean} includeEmptyChildrenArray represents whether to include nodes value with no children attribute.
     * @param {Integer} value Representing the value of node
     * @returns An Array of all node values to be removed from expanded array
     */
    const getAllChildrenValues = (value, includeEmptyChildrenArray, isUnChecked) => {
        let parentNodes = [];
        let node = dfs_algo_on_nodes(props.nodes, value, parentNodes, includeEmptyChildrenArray);
        let valuesArray = [];
        let partialParentNodesArray = [];
        let excludePartialParentNodesArray = [];
        populateValuesArrayRecursively(node, valuesArray, includeEmptyChildrenArray);
        if (includeEmptyChildrenArray) {
            isUnChecked ? populatePartialNodeArrays(value, parentNodes, partialParentNodesArray, valuesArray, excludePartialParentNodesArray) : populateValuesArrayWithParentNodeValues(valuesArray, parentNodes, value, partialParentNodesArray);
        }
        return {
            valuesArray,
            partialParentNodesArray,
            excludePartialParentNodesArray
        }
    }

    const populatePartialNodeArrays = (value, parentNodes = [], partialParentNodesArray = [], valuesArray = [], excludePartialParentNodesArray = []) => {
        let node;
        for (let j = parentNodes.length - 1; j >= 0; j--) {
            node = parentNodes[j];
            let bool = false;
            for (let i = 0; i < node.children.length; i++) {
                if ((node.children[i].value !== value) && props.checked.includes(node.children[i].value)) {
                    partialParentNodesArray.push(node.value);
                    bool = true;
                    break;
                }
            }
            if (!bool) {
                excludePartialParentNodesArray.push(node.value);
            }
        }



        // let node, isParent, include;
        // for (let j = parentNodes.length - 1; j >= 0; j--) {
        //     node = parentNodes[j];
        //     isParent = false;
        //     include = false;
        //     for (let i = 0; i < node.children.length; i++) {
        //         if((!valuesArray.includes(node.children[i].value) && props.checked.includes(node.children[i].value)) || partialParentNodesArray.includes(node.children[i].value)){
        //             include = true;
        //             break;
        //         }
        //         // if(node.children[i].value === value){
        //         //     include = false;
        //         // }
        //         // if (node.children[i].value === value || valuesArray.includes(node.children[i].value)) {
        //         //     valuesArray.push(node.value);
        //         //     break;
        //         // }
        //         // else if (((node.children[i].value !== value) && props.checked.includes(node.children[i].value)) || partialParentNodesArray.includes(node.children[i].value)) {
        //         //     partialParentNodesArray.push(node.value);
        //         //     break;
        //         // }
        //     }
        //     if(include){
        //         partialParentNodesArray.push(node.value);
        //     } else {
        //         valuesArray.push(node.value);
        //     }
        // }
    }

    /**
     * This function loops through all the parentNodes and populates the values array and partial parents array accordingly
     * @param {Array} valuesArray An Array of checked or unchecked values
     * @param {Array} parentNodes An Array of parent values of checked or unchecked nodes
     * @param {Integer} value An Integer representing the value of checked or unchecked item
     * @param {Array} partialParentNodesArray An Array of partially checked parent nodes
     */
    const populateValuesArrayWithParentNodeValues = (valuesArray = [], parentNodes = [], value, partialParentNodesArray = []) => {
        let node;
        for (let j = parentNodes.length - 1; j >= 0; j--) {
            node = parentNodes[j];
            let bool = false;
            for (let i = 0; i < node.children.length; i++) {
                if ((node.children[i].value !== value) && (!props.checked.includes(node.children[i].value)) && (!valuesArray.includes(node.children[i].value))) {
                    partialParentNodesArray.push(node.value);
                    bool = true;
                    break;
                }
                // if(props.checked.includes(node.children[i].value)){
                //     partialParentNodesArray.push(node.value);
                // }
            }
            if (!bool) {
                valuesArray.push(node.value);
            }
        }
    }

    /**
     * This function recursively updates the valuesArray with all the node values which can be used to remove them from expanded array
     * @param {Object} node An Object representing indiviudal node
     * @param {Array} valuesArray A list of all child nodes values which has children
     * @param {Boolean} includeEmptyChildrenArray represents whether to include nodes value with no children attribute.
     */
    const populateValuesArrayRecursively = (node = {}, valuesArray = [], includeEmptyChildrenArray = false) => {
        if ((node.children && node.children.length) || includeEmptyChildrenArray) {
            valuesArray.push(node.value)
            node.children && node.children.forEach(item => {
                populateValuesArrayRecursively(item, valuesArray, includeEmptyChildrenArray);
            })
        }
    }

    /**
     * Performs a dfs algorithm on nodes array to find the particular node whose value is same as value provided as attribute
     * @param {Array} nodes An Array of nodes
     * @param {Integer} value An Integer representing the value of node
     * @param {Boolean} includeEmptyChildrenArray represents whether to include nodes value with no children attribute.
     * @returns A Node Object
     */
    const dfs_algo_on_nodes = (nodes = [], value, parentNodes = [], includeEmptyChildrenArray = false) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].value === value) {
                return nodes[i];
            }
            if ((nodes[i].children && nodes[i].children.length) || includeEmptyChildrenArray) {
                parentNodes.push(nodes[i]);
                let node = dfs_algo_on_nodes(nodes[i].children, value, parentNodes, includeEmptyChildrenArray);
                if (node) {
                    return node;
                } else {
                    let index = parentNodes.indexOf(nodes[i]);
                    parentNodes.splice(index, 1);
                }
            }
        }
    }

    const handleChecked = (e, value) => {
        let selectedItems = [...props.checked];
        if (e.target.checked) {
            if (!props.noCascade) {
                let {
                    valuesArray,
                    partialParentNodesArray
                } = getAllChildrenValues(value, true);
                let newPartialChecked = [...partialChecked]
                newPartialChecked.push(...partialParentNodesArray)
                newPartialChecked = newPartialChecked.filter(value => !valuesArray.includes(value))
                setPartialChecked(newPartialChecked);
                selectedItems.push(...valuesArray);
            } else {
                selectedItems.push(value);
            }
        }
        else {
            if (!props.noCascade) {
                let {
                    valuesArray,
                    partialParentNodesArray,
                    excludePartialParentNodesArray
                } = getAllChildrenValues(value, true, true);
                // setPartialChecked(partialParentNodesArray);
                let newPartialChecked = partialChecked.filter(value => !excludePartialParentNodesArray.includes(value));
                newPartialChecked.push(...partialParentNodesArray)
                setPartialChecked(newPartialChecked);
                selectedItems = selectedItems.filter(value => !valuesArray.includes(value) && !partialParentNodesArray.includes(value))
            } else {
                let index = selectedItems.indexOf(value);
                selectedItems.splice(index, 1);
            }
        }
        props.onCheck(selectedItems);
    }

    /**
     * This function iterates through all its children and adds value to expanded array
     * This expanded array is used to open all nodes by default if expandAll prop is true
     * @param {Array} nodes An Array of nodes
     * @param {Array} expandedArray An Array of expanded nodes
     */
    const getExpandedArray = (nodes = [], expandedArray = []) => {
        nodes.forEach(element => {
            expandedArray.push(element.value);
            if (element.children) {
                getExpandedArray(element.children, expandedArray);
            }
        });
    }

    /**
     * This function repeatedly runs for all children and generates JSX element to be rendered.
     * @param {Array} nodes An Array of nodes to be rendered
     * @returns JSX elements with list of all nodes
     */
    const getOrderlist = (nodes = []) => {
        return (
            <ol className="checkbox-list">
                {nodes.map((item, index) => {
                    let isChecked = props.checked.includes(item.value);
                    let partialCheck = partialChecked.includes(item.value);
                    let isExpanded = props.expanded ? props.expanded.includes(item.value) : false;
                    return (
                        <li key={index} className={`checkbox-item ${isExpanded ? 'expanded-true' : 'expanded-false'}`}>
                            <span className='d-flex align-items-center rct-text'>
                                {item.children ?
                                    !isExpanded ?
                                        <span className={`material-icons-outlined expanded-false icon ${props.expandDisabled ? 'disabled' : ''}`} onClick={() => !props.expandDisabled && handleChevron(item.value, true)}>
                                            chevron_right
                                        </span>
                                        :
                                        <span className={`material-icons-outlined expanded-true icon ${props.expandDisabled ? 'disabled' : ''}`} onClick={() => !props.expandDisabled && handleChevron(item.value, false)}>
                                            expand_more
                                        </span>
                                    :
                                    <></>
                                }
                                <label className={`checkbox-container`}>
                                    <input className={`${props.disabled ? 'disabled' : ''}${partialCheck ? 'partialCheck' : ''}`} type='checkbox' disabled={props.disabled} id={item.label} name={props.name} onChange={(e) => handleChecked(e, item.value)} checked={isChecked} />
                                    <span className={`checkbox ${partialCheck ? 'partialCheckmark' : 'checkmark'}`}></span>
                                </label>
                                <label className="text rct-title mb-0 d-flex align-tems-center" key={item.value} htmlFor={item.label}>
                                    {
                                        props.folderIcons ?
                                            item.children && item.children.length ?
                                                <span class="material-icons-outlined folder">
                                                    folder
                                                </span> :
                                                <span class="material-icons-outlined folder">
                                                    description
                                                </span>
                                            :
                                            <></>
                                    }
                                    <span>{item.label}</span>
                                </label>
                                {isChecked && item.renderOnCheck ? item.renderOnCheck : <></>}
                            </span>
                            {item.children && isExpanded ? getOrderlist(item.children) : <></>}
                        </li>
                    )
                })}
            </ol>
        )
    }
    const handleExpandToggle = (c) => {
        let expandedArray = [];
        if (c) {
            getExpandedArray(props.nodes, expandedArray);
        }
        props.onExpand(expandedArray);
    }

    return (
        <div className='rc-checkbox-tree' {...(props.id ? { id: props.id } : {})}>
            {props.showExpandToggleButtons ?
                <div className='d-flex justify-content-end'>
                    <div className='tooltipTrigger' onClick={(e) => { e.stopPropagation(); handleExpandToggle(1) }}>
                        <button>+</button>
                        <span className='tooltip'>Expand All</span>
                    </div>
                    <div className='tooltipTrigger' onClick={(e) => { e.stopPropagation(); handleExpandToggle(0) }}>
                        <button style={{ marginLeft: 2 }}>-</button>
                        <span className='tooltip'>Collapse All</span>
                    </div>
                </div>
                :
                <></>
            }
            {getOrderlist(props.nodes)}
        </div>
    )
}

export default React.memo(CustomCheckBox);